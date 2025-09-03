import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";
import faqs from "../data/faq"; // Assuming you have a data file for FAQs
import companies from "../data/companies"; // Assuming you have a data file for companies
import Autoplay from "embla-carousel-autoplay";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center gradient-title text-4xl font-extrabold sm:text-6xl lg:text-8xl tracking-tighter py-6">
          Find your Dream Job{" "}
          <span className="flex items-center gap-2 sm:gap-4">
            with{" "}
            <img
              src="/CareerB_logo.png"
              alt="CareerBee logo"
              className="h-14 sm:h-24 lg:h-32"
            />
          </span>
        </h1>
        <p className="text-gray-300 mt-2 sm:mt-4 text-sm sm:text-xl font-medium tracking-wide max-w-md sm:max-w-2xl mx-auto text-center leading-relaxed px-4">
          Your journey to success starts here. Explore opportunities, connect
          with employers, and take the next step in your career.
        </p>
      </section>
      <div className="flex justify-evenly items-center flex-wrap gap-4 sm:gap-7 px-4">
        <Link to="/jobs">
          <Button variant="apply" className="text-base" size="xl">
            Explore Jobs
          </Button>
        </Link>
        <Link to="/post-job">
          <Button variant="post" className="text-base" size="xl">
            Post a Job
          </Button>
        </Link>
      </div>
      <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full py-10">
        <CarouselContent className="flex gap-6 sm:gap-20 items-center justify-center">
          {companies.map(({ name, id, path }) => {
            return (
              <CarouselItem
                key={id}
                className="basis-1/3 sm:basis-1/4 lg:basis-1/5"
              >
                <img
                  src={path}
                  alt={name}
                  className="h-9 sm:h-14 object-contain"
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      <section className="w-full flex justify-center px-4 py-8">
        <div className="w-full flex justify-center">
          <img
            src="/Banner.png"
            alt="CareerBee Banner"
            className="w-full max-w-2xl sm:max-w-4xl lg:max-w-6xl h-auto object-contain rounded-xl shadow-lg"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 px-4 justify-center">
        <Card className="w-full max-w-md mx-auto rounded-2xl shadow-lg bg-card border border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold">For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">
              Browse through thousands of job listings, apply directly, and
              connect with potential employers to find your perfect job match.
            </p>
          </CardContent>
        </Card>
        <Card className="w-full max-w-md mx-auto rounded-2xl shadow-lg bg-card border border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold">For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">
              Post jobs, find the right candidates, and manage your hiring
              process efficiently.
            </p>
          </CardContent>
        </Card>
      </section>
      <section className="w-full max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="space-y-1">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger
                className="flex items-center justify-between text-base font-medium text-gray-200
               hover:text-yellow-400 transition py-2 relative
               after:content-[''] after:block after:h-[2px] after:w-0 
               after:bg-yellow-400 after:absolute after:left-0 after:bottom-0
               after:transition-all after:duration-300 hover:after:w-full"
              >
                <span>{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 leading-relaxed pl-2 pb-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
};

export default LandingPage;
