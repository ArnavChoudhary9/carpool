import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col w-full max-w-96 sm:min-w-96 sm:max-w-96 mx-auto">
        <h1 className="text-2xl font-medium">Sign up</h1>

        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>

        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          {/* <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input name="firstName" placeholder="First name" required />
            </div>
            <div className="flex-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input name="lastName" placeholder="Last name" />
            </div>
          </div> */}

          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />

          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />

          {/* <Label htmlFor="phone">Phone Number</Label>
          <Input
            type="tel"
            name="phone"
            placeholder="Your phone number"
            minLength={10}
            maxLength={10}
            pattern="[0-9]{10}"
            inputMode="numeric"
            required
          /> */}

          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>

          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
