import { createClient } from "@/utils/supabase/server";
import { completeProfileAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";

export default async function UserProfilePage(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4 pt-16">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data } = await supabase
    .from("user_profiles")
    .select("user_id, full_name, rating_avg")
    .eq("user_id", user.id)
    .single();

  const exists = !!data;

  return (
    <div className="flex-1 w-full flex flex-col gap-12 pt-16">
      <div className="flex flex-col gap-2 items-start">
        {!exists && (
          <form className="flex flex-col w-full max-w-96 sm:min-w-96 sm:max-w-96 mx-auto">
            <h1 className="text-2xl font-medium">Complete your profile</h1>

            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input name="firstName" placeholder="First name" required />
                </div>
                <div className="flex-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input name="lastName" placeholder="Last name" />
                </div>
              </div>

              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                name="phone"
                placeholder="Your phone number"
                minLength={10}
                maxLength={10}
                pattern="[0-9]{10}"
                inputMode="numeric"
                required
              />

              <SubmitButton formAction={completeProfileAction} pendingText="Processing...">
                Sign up
              </SubmitButton>

              <FormMessage message={searchParams} />
            </div>
          </form>
        )}

        {exists && (
            <div className="flex max-w-[36em] mx-auto items-center px-2 sm:px-0">
            <div className="flex flex-col gap-2 items-start">
              <div className="text-3xl font-thin">
              Welcome, {data.full_name || "User"}!
              </div>

              <div className="text-muted-foreground flex items-center gap-1">
              <span className="text-xl leading-none">★</span>
              <span>{data.rating_avg || 0} / 5</span>
              </div>
            </div>
            </div>
        )}
      </div>
    </div>
  );
}
