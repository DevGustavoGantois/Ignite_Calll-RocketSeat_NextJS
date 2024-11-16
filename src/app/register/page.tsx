"use client";

import { ArrowRight } from "lucide-react";
import "./register.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "O usuário precisa ter pelo menos 3 letras." })
    .regex(/^([a-z\\-]+)$/i, {
      message: "O usuário pode ter apenas letras e hifens.",
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: "O nome precisa ter pelo menos 3 letras." }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  const session = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const router = useRouter();

  useEffect(() => {
    if (router.query.username) {
      setValue("username", String(router.query.username));
    }
  }, [router.query?.username, setValue]);

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post("/users", {
        name: data.name,
        username: data.username,
      });
      await router.push("/register/connect-calendar");
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message);
        return;
      }

      console.error(err);
    }
  }

  return (
    <>
      <NextSeo title="Crie uma Conta | Iginite Call" />
      <section className="containerRegister">
        <div className="headerRegister">
          <h2>Bem vindo ao Ignite Call!</h2>
          <p>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </p>
          <span className="step">
            <p>Passo 1 de 4</p>
          </span>
          <div className="containerVoidDiv">
            <div className="voidDiv" />
            <div className="voidDiv" />
            <div className="voidDiv" />
            <div className="voidDiv" />
          </div>
        </div>
        <form
          action=""
          className="formRegister"
          onSubmit={handleSubmit(handleRegister)}
        >
          <label>
            <p>Nome de usuário</p>
            <input
              type="text"
              prefix="ignite.com/"
              placeholder="seu-usuario"
              {...register("username")}
            />
            {errors.username && (
              <p className="formError">{errors.username.message}</p>
            )}
          </label>
          <label>
            <p>Nome Completo</p>
            <input type="text" placeholder="seu Nome" {...register("name")} />
            {errors.username && (
              <p className="formError">{errors.username.message}</p>
            )}
          </label>
          <button type="submit" disabled={isSubmitting}>
            Proximo passo <ArrowRight />
          </button>
        </form>
      </section>
    </>
  );
}
