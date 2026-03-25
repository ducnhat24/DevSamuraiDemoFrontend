import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { logout } from "@/store/authSlice"
import { axiosInstance } from "@/lib/axios"

// Đã thêm ChevronsUpDown và Ellipsis cho giống y bản gốc
import { LayoutDashboard, UserSearch, Bot, Settings, Users, CreditCard, Coins, LogOut, ChevronsUpDown, Ellipsis } from "lucide-react"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function AppSidebar() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const user = useAppSelector((state) => state.auth.user)

    const handleLogout = async () => {
        try { await axiosInstance.post('/auth/logout') } catch (e) { console.error(e) }
        finally { dispatch(logout()); navigate('/login') }
    }

    return (
        <Sidebar collapsible="icon" variant="inset" className="dark:bg-slate-950 border-r border-r-slate-800/50">
            {/* 1. HEADER: Nút Dropdown chuyển đổi Organization (Workspace) */}
            <SidebarHeader className="p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                {/* Thêm !p-0 và justify-center khi collapse */}
                                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground text-slate-200 hover:text-white hover:bg-slate-900 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center">
                                    <Avatar className="size-8 rounded-md">
                                        <AvatarFallback className="rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-bold uppercase">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Thêm class tàng hình (hidden) khi collapse cho phần Text */}
                                    <div className="flex flex-col items-start gap-0.5 overflow-hidden text-left flex-1 group-data-[collapsible=icon]:hidden">
                                        <span className="block w-full truncate font-semibold leading-tight">
                                            {user?.name || "User"} {/* Có tên thật thì hiện, không thì fallback */}
                                        </span>
                                    </div>
                                    {/* Thêm class tàng hình (hidden) khi collapse cho Mũi tên */}
                                    <ChevronsUpDown className="ml-auto block size-4 shrink-0 text-slate-500 group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-slate-900 border-slate-800 text-white" align="start" side="bottom" sideOffset={4}>
                                <DropdownMenuItem className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800">
                                    <span>Project 1</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* 2. CONTENT: Menu điều hướng chính */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-slate-500 font-medium">Application</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton isActive tooltip="Dashboard" className="text-slate-300 hover:text-white hover:bg-slate-900">
                                <LayoutDashboard /><span>Dashboard</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="Leads" className="text-slate-400 hover:text-white hover:bg-slate-900">
                                <UserSearch /><span>Leads</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="AI Chatbot" className="text-slate-400 hover:text-white hover:bg-slate-900">
                                <Bot /><span>AI Chatbot</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-slate-500 font-medium">Settings</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="General" className="text-slate-400 hover:text-white hover:bg-slate-900">
                                <Settings /><span>General</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="Members" className="text-slate-400 hover:text-white hover:bg-slate-900">
                                <Users /><span>Members</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="Subscription" className="text-slate-400 hover:text-white hover:bg-slate-900">
                                <CreditCard /><span>Subscription</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="Credits" className="text-slate-400 hover:text-white hover:bg-slate-900">
                                <Coins /><span>Credits</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* 3. FOOTER: Thông tin User kèm nút Logout */}
            <SidebarFooter className="p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                {/* Thêm !p-0 và justify-center khi collapse */}
                                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground text-slate-200 hover:text-white hover:bg-slate-900 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center">
                                    <Avatar className="size-8 rounded-full">
                                        {/* Ảnh Avatar xịn */}
                                        <AvatarImage src={`https://api.dicebear.com/9.x/glass/svg?seed=${user?.name || user?.email || 'User'}`} alt={user?.name || 'User Avatar'} />
                                        <AvatarFallback className="rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                                            {(user?.name || 'U').charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Thêm class tàng hình (hidden) khi collapse cho phần Text */}
                                    <div className="flex w-full flex-col truncate text-left group-data-[collapsible=icon]:hidden">
                                        <p className="truncate font-medium text-sm leading-tight">{user?.name || 'Nhật Giang Đức'}</p>
                                        <p className="text-slate-400 text-xs leading-tight mt-1">{user?.email || 'ducnhaat@gmail.com'}</p>
                                    </div>
                                    {/* Thêm class tàng hình (hidden) khi collapse cho dấu 3 chấm */}
                                    <Ellipsis className="ml-auto size-4 text-slate-500 group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-slate-900 border-slate-800 text-white shadow-xl" side="bottom" align="end" sideOffset={4}>
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 hover:text-red-500 hover:bg-slate-800 focus:text-red-500 focus:bg-slate-800">
                                    <LogOut className="mr-2 size-4" />
                                    <span>Đăng xuất</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}