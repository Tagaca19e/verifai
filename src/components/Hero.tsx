import Image from 'next/image';

export default function Hero() {
  return (
    <div className="bg-white">
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto lg:grid lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <div className="mt-24 sm:mt-32 lg:mt-16">
                  <a href="#" className="inline-flex space-x-6">
                    <span className="rounded-full bg-primary px-3 py-1 text-sm font-semibold leading-6 text-white ring-1 ring-inset ring-indigo-600/10">
                      Beta v1.0.0
                    </span>
                  </a>
                </div>
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  A.I. Content Verification Made Easy
                </h1>
                <p className="mt-6 text-xl leading-8 text-gray-600">
                  Upload, save, and verify your documents for AI content.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <a
                    href="https://github.com/Tagaca19e/verifai"
                    target="blank"
                    className="rounded-full border border-gray-500 px-3 py-1 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                  >
                    View on GitHub <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            <div className="rouded-xl relative h-[500px] px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
              <Image
                className="rounded-3xl border border-gray-300 object-cover object-left shadow-lg"
                src="/hero.svg"
                alt="Document example"
                fill
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
      </div>
    </div>
  );
}
