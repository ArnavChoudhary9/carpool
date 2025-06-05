import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

import RideMapForm from "@/components/RideMapForm";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  const exists = !!data;

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      {!exists &&
        <div className="max-w-96 pt-16">
          <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
            <InfoIcon size="16" strokeWidth={2} />
            <span>
              Your profile is not complete. Please fill out your profile{" "}
              <a href="/user/profile" className="underline text-primary">here</a>
            </span>
          </div>
        </div>
      }

      {exists && (
        <RideMapForm />
      )}
    </div>
  );
}
