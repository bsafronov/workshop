"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userInsertSchema } from "@/db/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

const schema = userInsertSchema
  .and(
    z.object({
      rePassword: z.string(),
    })
  )
  .superRefine(({ password, rePassword }, ctx) => {
    if (password !== rePassword) {
      ctx.addIssue({
        code: "custom",
        message: "Пароли не совпадают",
        path: ["rePassword"],
      });
    }
  });
export default function Page() {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(schema),
  });

  const trpc = useTRPC();
  const { mutate, isPending } = useMutation(
    trpc.auth.register.mutationOptions({
      onSuccess: () => {
        toast.success("Регистрация прошла успешно");
      },
      onError: (e) => toast.error(e.message),
    })
  );

  const onSubmit = form.handleSubmit((data) => mutate(data));

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card className="w-sm">
          <CardHeader>
            <CardTitle>Регистрация</CardTitle>
            <CardDescription>
              Уже зарегистрированы? <Link href={"/auth/login"}>Войти</Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя пользователя</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rePassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Повторите пароль</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button isLoading={isPending}>Зарегистрироваться</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
