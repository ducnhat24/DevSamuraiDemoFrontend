import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch } from '@/store/hooks'
import { setCredentials } from '@/store/authSlice'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { useTheme } from "@/components/theme-provider"
import { axiosInstance } from '@/lib/axios'


const registerSchema = z.object({
    name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }),
    email: z.string().email({ message: 'Email không đúng định dạng' }),
    password: z.string().min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' }),
})

const loginSchema = z.object({
    email: z.string().email({ message: 'Email không đúng định dạng' }),
    password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu' }),
})

function PasswordEyeAddon({ showPassword, onToggle }: {
    showPassword: boolean
    onToggle: () => void
}) {
    return (
        <div className={eyeAddonEndClass}>
            <button
                type="button"
                onClick={onToggle}
                aria-label="Toggle password visibility"
                className={eyeButtonClass}
            >
                {showPassword
                    ? <EyeOff className="size-4 shrink-0" aria-hidden />
                    : <Eye className="size-4 shrink-0" aria-hidden />
                }
            </button>
        </div>
    )
}

function AcmeLogo() {
    return (
        <a className="mx-auto block w-fit" href="/">
            <span className="flex items-center font-semibold text-foreground leading-none">
                <div className="flex size-9 items-center justify-center p-1">
                    <div className="flex size-7 items-center justify-center rounded-md border bg-primary text-primary-foreground">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <path d="M7.81815 8.36373L12 0L24 24H15.2809L7.81815 8.36373Z" fill="currentColor" />
                                <path d="M4.32142 15.3572L8.44635 24H0L4.32142 15.3572Z" fill="currentColor" />
                            </g>
                        </svg>
                    </div>
                </div>
                {/* QUAN TRỌNG: bản gốc dùng hidden md:block */}
                <span className="ml-2 hidden font-bold text-lg md:block">Acme</span>
            </span>
        </a>
    )
}

function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="size-4 shrink-0">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53" />
            <path fill="none" d="M1 1h22v22H1z" />
        </svg>
    )
}

function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    return (
        <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer text-sm font-medium transition-all outline-none border shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 size-9 bg-background fixed right-2 bottom-2 rounded-full"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                className="lucide lucide-sun size-5 shrink-0 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true">
                <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" /><path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                className="lucide lucide-moon absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true">
                <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
            </svg>
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}

// Input group classes — copy y chang từ bản gốc
const inputGroupClass = [
    'group/input-group border-input dark:bg-input/30',
    'relative flex w-full items-center rounded-md border shadow-xs',
    'transition-[color,box-shadow] outline-none h-9 min-w-0',
    'has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-focus-visible:ring-[3px]',
    'has-[[data-slot][aria-invalid=true]]:ring-destructive/20',
    'has-[[data-slot][aria-invalid=true]]:border-destructive',
    'dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40',
].join(' ')

const addonStartClass = [
    'text-muted-foreground flex h-auto cursor-text items-center justify-center',
    'gap-2 py-1.5 text-sm font-medium select-none',
    '[&>svg:not([class*="size-"])]:size-4',
    'group-data-[disabled=true]/input-group:opacity-50',
    'order-first pl-3',
].join(' ')

const inputClass = [
    'flex h-9 w-full min-w-0 border-input px-3 py-1 text-sm outline-none',
    'transition-[color,box-shadow]',
    'selection:bg-primary selection:text-primary-foreground',
    'placeholder:text-muted-foreground',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    'md:text-sm',
    'focus-visible:border-ring focus-visible:ring-ring/50',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
    'dark:aria-invalid:ring-destructive/40',
    'flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent',
].join(' ')

const eyeAddonEndClass = [
    'text-muted-foreground flex h-auto cursor-text items-center justify-center',
    'gap-2 py-1.5 text-sm font-medium select-none',
    '[&>svg:not([class*="size-"])]:size-4',
    'group-data-[disabled=true]/input-group:opacity-50',
    'order-last pr-3 has-[>button]:mr-[-0.45rem]',
].join(' ')

const eyeButtonClass = [
    'justify-center whitespace-nowrap cursor-pointer font-medium transition-all',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0',
    'outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
    'text-sm shadow-none flex gap-2 items-center size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0',
].join(' ')

export default function Login() {
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', password: '' },
    })

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    })

    const onSubmit = async (data: any) => {
        try {
            if (authMode === 'login') {
                // 1. Gọi API Đăng nhập
                const response = await axiosInstance.post('/auth/login', {
                    email: data.email,
                    password: data.password,
                });

                // 2. Lấy data từ Backend trả về (Tùy theo cấu trúc JSON của ông, tui đang ví dụ là response.data có chứa accessToken và user)
                const { accessToken, refreshToken, user } = response.data;

                // 3. Cất vào kho Redux
                dispatch(setCredentials({ user, accessToken, refreshToken }));

                // 4. Chuyển hướng sang Dashboard
                navigate('/dashboard');
            } else {
                // Chỗ này mốt ông gọi API Đăng ký nha
                const response = await axiosInstance.post('/auth/signup', {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                });
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                toggleAuthMode();
            }
        } catch (error: any) {
            // Báo lỗi nếu sai email/mật khẩu
            console.error("Lỗi API:", error);
            alert(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
        }
    }

    const toggleAuthMode = () => {
        setAuthMode(authMode === 'login' ? 'register' : 'login')
        setShowPassword(false)
        loginForm.reset()
        registerForm.reset()
    }



    return (
        <main className="h-screen bg-neutral-50 px-4 dark:bg-background">
            <div className="mx-auto w-full min-w-[320px] max-w-sm space-y-6 py-12">
                <AcmeLogo />

                {authMode === 'login' ? (
                    <Form {...loginForm}>
                        <form key="login-form" onSubmit={loginForm.handleSubmit(onSubmit)}>
                            <Card className="flex flex-col gap-6 rounded-xl border bg-card text-card-foreground shadow-xs w-full border-transparent px-4 py-8 dark:border-border">
                                {/* CardHeader dùng data-slot y chang bản gốc */}
                                <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 [.border-b]:pb-6">
                                    <CardTitle className="font-semibold text-base lg:text-lg">Sign in to your account</CardTitle>
                                    <CardDescription className="text-muted-foreground text-sm">Welcome back! Please sign in to continue.</CardDescription>
                                </CardHeader>

                                <CardContent className="px-6 flex flex-col gap-4">
                                    <div className="space-y-4">
                                        {/* Email */}
                                        <FormField
                                            control={loginForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="group/field w-full data-[invalid=true]:text-destructive flex-col [&>*]:w-full [&>.sr-only]:w-auto grid gap-2">
                                                    <FormLabel className="flex items-center gap-2 font-medium text-sm leading-none">Email</FormLabel>
                                                    <FormControl>
                                                        <div className={inputGroupClass}>
                                                            <div className={addonStartClass}>
                                                                <span className="text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4">
                                                                    <Mail className="size-4 shrink-0" aria-hidden />
                                                                </span>
                                                            </div>
                                                            <input
                                                                type="email"
                                                                autoCapitalize="off"
                                                                autoComplete="username"
                                                                maxLength={255}
                                                                className={inputClass}
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Password */}
                                        <FormField
                                            control={loginForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem className="group/field w-full data-[invalid=true]:text-destructive flex-col [&>*]:w-full [&>.sr-only]:w-auto grid gap-2">
                                                    <div className="flex flex-row items-center justify-between">
                                                        <FormLabel className="flex items-center gap-2 font-medium text-sm leading-none">Password</FormLabel>
                                                        <a className="ml-auto inline-block text-sm underline" href="/auth/forgot-password">Forgot password?</a>
                                                    </div>
                                                    <FormControl>
                                                        <div className={inputGroupClass}>
                                                            <div className={addonStartClass}>
                                                                <span className="text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4">
                                                                    <Lock className="size-4 shrink-0" aria-hidden />
                                                                </span>
                                                            </div>
                                                            <input
                                                                type={showPassword ? 'text' : 'password'}
                                                                autoCapitalize="off"
                                                                autoComplete="current-password"
                                                                maxLength={72}
                                                                className={inputClass}
                                                                {...field}
                                                            />
                                                            <PasswordEyeAddon
                                                                showPassword={showPassword}
                                                                onToggle={() => setShowPassword(!showPassword)}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <button
                                            type="submit"
                                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md cursor-pointer text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 w-full"
                                        >
                                            Sign in
                                        </button>
                                    </div>

                                    <div className="relative my-1 h-4">
                                        <hr className="relative top-2" />
                                        <p className="-translate-x-1/2 absolute top-0 left-1/2 mx-auto inline-block h-4 bg-card px-2 text-center font-medium text-foreground/60 text-sm leading-tight">
                                            Or continue with
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 items-stretch gap-2">
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md cursor-pointer text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 w-full gap-2"
                                        >
                                            <GoogleIcon />
                                            <span>Google</span>
                                        </button>
                                    </div>
                                </CardContent>

                                <div data-slot="card-footer" className="items-center px-6 flex justify-center gap-1 text-muted-foreground text-sm">
                                    <span>Don't have an account?</span>
                                    <button type="button" onClick={toggleAuthMode} className="text-foreground underline">Sign up</button>
                                </div>
                            </Card>
                        </form>
                    </Form>
                ) : (
                    <Form {...registerForm}>
                        <form key="register-form" onSubmit={registerForm.handleSubmit(onSubmit)}>
                            <Card className="flex flex-col gap-6 rounded-xl border bg-card text-card-foreground shadow-xs w-full border-transparent px-4 py-8 dark:border-border">
                                <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 [.border-b]:pb-6">
                                    <CardTitle className="font-semibold text-base lg:text-lg">Create your account</CardTitle>
                                    <CardDescription className="text-muted-foreground text-sm">Please fill in the details to get started.</CardDescription>
                                </CardHeader>

                                <CardContent className="px-6 flex flex-col gap-4">
                                    <div className="flex flex-col items-stretch gap-4">
                                        {/* Name */}
                                        <FormField
                                            control={registerForm.control}
                                            name="name"
                                            render={({ field }) => {
                                                console.log("Current Value của Name:", field.value);
                                                return (
                                                    <FormItem className="group/field w-full data-[invalid=true]:text-destructive flex-col [&>*]:w-full [&>.sr-only]:w-auto grid gap-2">
                                                        <FormLabel className="flex items-center gap-2 font-medium text-sm leading-none">Name</FormLabel>
                                                        <FormControl>
                                                            <div className={inputGroupClass}>
                                                                <div className={addonStartClass}>
                                                                    <span className="text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4">
                                                                        <User className="size-4 shrink-0" aria-hidden />
                                                                    </span>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    autoComplete="name"
                                                                    maxLength={64}
                                                                    className={inputClass}
                                                                    {...field}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )
                                            }
                                            }
                                        />

                                        {/* Email — dùng registerForm.control, KHÔNG phải loginForm */}
                                        <FormField
                                            control={registerForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="group/field w-full data-[invalid=true]:text-destructive flex-col [&>*]:w-full [&>.sr-only]:w-auto grid gap-2">
                                                    <FormLabel className="flex items-center gap-2 font-medium text-sm leading-none">Email</FormLabel>
                                                    <FormControl>
                                                        <div className={inputGroupClass}>
                                                            <div className={addonStartClass}>
                                                                <span className="text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4">
                                                                    <Mail className="size-4 shrink-0" aria-hidden />
                                                                </span>
                                                            </div>
                                                            <input
                                                                type="email"
                                                                autoComplete="username"
                                                                maxLength={255}
                                                                className={inputClass}
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Password — dùng registerForm.control */}
                                        <FormField
                                            control={registerForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem className="group/field w-full data-[invalid=true]:text-destructive flex-col [&>*]:w-full [&>.sr-only]:w-auto grid gap-2">
                                                    <FormLabel className="flex items-center gap-2 font-medium text-sm leading-none">Password</FormLabel>
                                                    <FormControl>
                                                        <div className={inputGroupClass}>
                                                            <div className={addonStartClass}>
                                                                <span className="text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4">
                                                                    <Lock className="size-4 shrink-0" aria-hidden />
                                                                </span>
                                                            </div>
                                                            <input
                                                                type={showPassword ? 'text' : 'password'}
                                                                autoCapitalize="off"
                                                                autoComplete="current-password"
                                                                maxLength={72}
                                                                className={inputClass}
                                                                {...field}
                                                            />
                                                            <PasswordEyeAddon
                                                                showPassword={showPassword}
                                                                onToggle={() => setShowPassword(!showPassword)}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    {/* "8 or more characters" hint y chang bản gốc */}
                                                    <div className="flex items-center gap-1.5 px-1 font-medium text-[0.8rem] text-muted-foreground">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-x h-3.5 w-3.5 shrink-0" aria-hidden="true">
                                                            <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
                                                        </svg>
                                                        <p>8 or more characters</p>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <button
                                            type="submit"
                                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md cursor-pointer text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 w-full"
                                        >
                                            Create account
                                        </button>
                                    </div>

                                    <div className="relative my-1 h-4">
                                        <hr className="relative top-2" />
                                        <p className="-translate-x-1/2 absolute top-0 left-1/2 mx-auto inline-block h-4 bg-card px-2 text-center font-medium text-foreground/60 text-sm leading-tight">
                                            Or continue with
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 items-stretch gap-2">
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md cursor-pointer text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 w-full gap-2"
                                        >
                                            <GoogleIcon />
                                            <span>Google</span>
                                        </button>
                                    </div>
                                </CardContent>

                                <div data-slot="card-footer" className="items-center px-6 flex justify-center gap-1 text-muted-foreground text-sm">
                                    <span>Already have an account?</span>
                                    <button type="button" onClick={toggleAuthMode} className="text-foreground underline">Sign in</button>
                                </div>
                            </Card>
                        </form>
                    </Form>
                )}
            </div>

            <ThemeToggle />
        </main>
    )
}