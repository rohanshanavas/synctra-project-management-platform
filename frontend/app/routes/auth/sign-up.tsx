import { signUpSchema } from '@/lib/schema';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { useSignUpMutation } from '@/hooks/useAuth';
import { toast } from 'sonner';

export type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: ""
    }
  });

  const { mutate, isPending } = useSignUpMutation();

  const handleOnSubmit = (data: SignUpFormData) => {
    mutate(data, {
      onSuccess: (response) => {
        toast.success("Account created successfully!");
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "An error occurred while creating the account.";
        console.log(error);
        toast.error(errorMessage);
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center mb-5">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Please fill in the details to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <FieldContent>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      {...field}
                    />
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <FieldContent>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      {...field}
                    />
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <FieldContent>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <FieldContent>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
          <CardFooter className=" flex items-center justify-center bg-transparent border-0">
            <div className="flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Already have an account? <Link to="/sign-in">Sign In</Link>
              </p>
            </div>
          </CardFooter>
        </CardContent>

      </Card>
    </div>
  )
}

export default SignUp;
