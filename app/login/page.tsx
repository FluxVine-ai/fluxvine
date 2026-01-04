import LoginForm from '@/components/auth/login-form'

export default async function LoginPage(props: any) {
    const searchParams = await props.searchParams
    const message = searchParams?.message

    return (
        <div className="home-container">
            <LoginForm message={message} />
        </div>
    )
}
