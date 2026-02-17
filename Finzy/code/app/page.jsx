import HeroSection from "@/components/hero";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// 1st module dashboard
export default function Home() {
  return (
    <div className="mt-40">
      {/* Hero section */}
      {/* Bushra part start */}

     

      {/* bushra part sesh */}

      {/* jisan part start */}
      {/* Testimonial section */}
      <section className="py-20">

        <div className="container mx-auto px-4">

          <h2 className="text-3xl font-bold text-center mb-12">

            Real Stories-Real Results

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {testimonialsData.map((testimonial, index) => (

              <Card key={index} className="p-6">

                <CardContent className="pt-4">

                  <div className="flex items-center mb-4">

                    <Image

                      src={testimonial.image}

                      alt={testimonial.name}

                      width={40}

                      height={40}

                      className="rounded-full w-10 h-10"

                    />

                    <div className="ml-4">

                      <div className="font-semibold">{testimonial.name}</div>

                      <div className="text-sm text-gray-600">

                        {testimonial.role}

                      </div>

                    </div>

                  </div>

                  <p className="text-gray-600 text-sm italic leading-relaxed">

                    {testimonial.quote}

                  </p>

                </CardContent>

              </Card>

            ))}

          </div>

        </div>

      </section>

 

      {/* last cell */}

      <section className="py-20 bg-slate-900 text-white">

        <div className="container mx-auto px-4 text-center">

          <h2 className="text-3xl font-bold text-center mb-4">

            Ready to Take Control Your Finances?

          </h2>

          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">

            Transform the way you manage your money, gain clarity in every

            decision and move closer to your dreams with confidence.

          </p>

          <Link href="/dashboard">

            <Button

              size="lg"

              className="bg-white text-blue-700 font-semibold

               px-6 py-2.5 rounded-xl

               shadow-md shadow-blue-500/10

               transition-all duration-300 ease-out

               hover:-translate-y-1

               hover:bg-blue-600

               hover:text-white

               hover:shadow-xl hover:shadow-blue-500/30

 

               active:translate-y-0 active:shadow-md

               animate-[bounce_2s_infinite]"

            >

              Start Free Trial

            </Button>

          </Link>

        </div>

      </section> 
      {/* jisan part sesh */}
    </div>
  );
}
