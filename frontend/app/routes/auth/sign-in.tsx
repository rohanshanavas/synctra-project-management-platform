import { signInSchema } from '@/lib/schema';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {

    const form = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const handleOnSubmit = (data: SignInFormData) => {
        console.log(data);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center mb-5">
                    <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Please sign in to your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-4">
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
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                    <CardFooter>
                        <div className="flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account? {" "}
                                <Link to="/sign-up">Sign Up</Link>
                            </p>
                        </div>
                    </CardFooter>
                </CardContent>

            </Card>
        </div>
    )
}

export default SignIn
