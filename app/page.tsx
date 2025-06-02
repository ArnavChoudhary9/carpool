import { Button } from '@/components/ui/button';

import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  return (
    <main className="w-full flex flex-col gap-6 px-0">
      <div className="flex items-center justify-center text-3xl font-bold text-center">
        {process.env.NEXT_PUBLIC_APP_NAME}
      </div>

      <Image
        src="/hero.png"
        alt="Carpooling Banner"
        width={1024}
        height={523}
        className="w-full object-cover rounded-lg"
      />

      <div className="flex items-center justify-center ">
        <span className="italic">
          Share the Ride, Save the Planet."
        </span>
      </div>

      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-up">Find Pool around you!</Link>
      </Button>
    </main>
  );
}
