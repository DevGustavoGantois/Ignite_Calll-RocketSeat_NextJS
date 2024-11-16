import { NextSeo } from 'next-seo';
import { ClaimUserNameForm } from './components/ClaimUserNameForm';
import './Hero.css';
import Image from 'next/image';

export function Hero() {
    return (
        <>
        <NextSeo title='Descomplique sua agenda | Iginite Call' description='Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.' />
        <main>
            <div className="container">
            <div className="hero">
                <h1>Agendamento descomplicado</h1>
                <p>
                    Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.
                </p>
                <ClaimUserNameForm />
            </div>
            <div className="preview">
                <Image src="/AppPreview.png" width={750} height={400} alt='Calendário simbolizando aplicação em funcionamento' quality={100} priority />
            </div>
            </div>
        </main>
        </>
    )
}