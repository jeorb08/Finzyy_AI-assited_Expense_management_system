export const triggerRecurringTransactions = inngest.createFunction({
        id: "trigger-recurring-transactions", // Unique ID,
        name: "Trigger Recurring Transactions",
    }, { cron: "0 0 * * *" }, // this cron job triggered every midnight
    async({ step }) => {
        const recurringTransactions = await step.run(
            "fetch-recurring-transactions",
            async() => {
                return await db.transaction.findMany({
                    where: {
                        isRecurring: true,
                        status: "COMPLETED",
                        OR: [
                            { lastProcessed: null },
                            {
                                nextRecurringDate: {
                                    lte: new Date(),
                                },
                            },
                        ]
                    }
                })
            }
        )

        // create events for each transactions
        if (recurringTransactions.length > 0) {
            const events = recurringTransactions.map((transaction) => ({
                name: "transaction.recurring.process",
                data: {
                    transactionId: transaction.id,
                    userId: transaction.userId,
                },
            }))
            await inngest.send(events);
        }
        return { triggered: recurringTransactions.length };
    }
)
export const processRecurringTransaction = inngest.createFunction({
        id: "process-recurring-transaction",
        name: "Process Recurring Transaction",
        throttle: {
            limit: 10, // Process 10 transactions
            period: "1m", // per minute
            key: "event.data.userId", // Throttle per user
        },
    }, { event: "transaction.recurring.process" },
    async({ event, step }) => {
        // Validate event data
        if (!event ? .data ? .transactionId || !event ? .data ? .userId) {
            console.error("Invalid event data:", event);
            return { error: "Missing required event data" };
        }
        await step.run("process-transaction", async() => {
            const transaction = await db.transaction.findUnique({
                where: {
                    id: event.data.transactionId,
                    userId: event.data.userId,
                },
                include: {
                    account: true,
                },
            })
            if (!transaction || !isTransactionDue(transaction)) return;

            // Create new transaction and update account balance in a transaction
            await db.$transaction(async(tx) => {
                // create new transaction
                await tx.transaction.create({
                        data: {
                            type: transaction.type,
                            amount: transaction.amount,
                            description: `${transaction.description} - Recurring`,
                            date: new Date(),
                            category: transaction.category,
                            userId: transaction.userId,
                            accountId: transaction.accountId,
                            isRecurring: false,
                        },
                    })
                    // update Account Balance
                const balanceChange =
                    transaction.type === "EXPENSE" ?
                    -transaction.amount.toNumber() :
                    transaction.amount.toNumber();

                await tx.account.update({
                    where: { id: transaction.accountId },
                    data: { balance: { increment: balanceChange } },
                })

                // last processed date
                await tx.transaction.update({
                    where: { id: transaction.id },
                    data: {
                        lastProcessed: new Date(),
                        nextRecurringDate: calculateNextRecurringDate(
                            new Date(),
                            transaction.recurringInterval
                        )
                    }
                })
            })
        })
    }
)
function isTransactionDue(transaction) {
    // If no lastProcessed date, transaction is due
    if (!transaction.lastProcessed) return true;

    const today = new Date();
    const nextDue = new Date(transaction.nextRecurringDate);

    // Compare with nextDue date
    return nextDue <= today;
}

//  calculate next reccuring date

function calculateNextRecurringDate(date, interval) {
    const next = new Date(date);
    switch (interval) {
        case "DAILY":
            next.setDate(next.getDate() + 1);
            break;
        case "WEEKLY":
            next.setDate(next.getDate() + 7);
            break;
        case "MONTHLY":
            next.setMonth(next.getMonth() + 1);
            break;
        case "YEARLY":
            next.setFullYear(next.getFullYear() + 1);
            break;
    }
    return next;
}