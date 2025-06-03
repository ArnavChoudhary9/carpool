import { Button } from '@/components/ui/button';

import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  return (
    <main className="w-full flex flex-col gap-6 px-0">
      <Image
        src="/hero.png"
        alt="Carpooling Banner"
        width={1024}
        height={200}
        className="w-full object-cover rounded-lg"
      />

      <div className="flex flex-col items-center justify-center ">
        <span className="italic">
          Share a Ride, Save the Planet.
        </span>

        <div className="pt-8">
          <Button asChild size="sm" variant={"default"}>
            <Link href="/sign-up">Find Pool around you!</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
