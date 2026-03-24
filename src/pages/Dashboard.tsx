import { useState } from "react" // THÊM useState
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AreaChart, Area, XAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts" // THÊM BarChart, Bar
import { ChevronRight } from "lucide-react"

import { AppSidebar } from "@/components/AppSidebar"
import { StatCard } from "@/components/StatCard"
import { ScrollArea } from "@/components/ui/scroll-area"

// --- DATA GIẢ LẬP CHO AREA CHART (Lượn sóng) ---
const mockAreaChartData = [
    { name: "Oct 4", marketing: 400, transactional: 240 },
    { name: "Oct 8", marketing: 300, transactional: 139 },
    { name: "Oct 12", marketing: 500, transactional: 380 },
    { name: "Oct 16", marketing: 280, transactional: 390 },
    { name: "Oct 20", marketing: 590, transactional: 480 },
    { name: "Oct 24", marketing: 390, transactional: 380 },
    { name: "Oct 28", marketing: 430, transactional: 430 },
    { name: "Nov 1", marketing: 310, transactional: 210 },
    { name: "Nov 5", marketing: 520, transactional: 310 },
    { name: "Nov 9", marketing: 290, transactional: 280 },
    { name: "Nov 13", marketing: 610, transactional: 490 },
    { name: "Nov 17", marketing: 410, transactional: 310 },
    { name: "Nov 21", marketing: 580, transactional: 400 },
    { name: "Nov 25", marketing: 480, transactional: 300 },
    { name: "Dec 3", marketing: 600, transactional: 450 },
    { name: "Dec 7", marketing: 420, transactional: 320 },
    { name: "Dec 11", marketing: 530, transactional: 410 },
    { name: "Dec 15", marketing: 390, transactional: 290 },
]

// --- DATA GIẢ LẬP CHO BAR CHART (Biểu đồ cột) ---
const mockBarChartData = [
    // --- THÁNG 10 ---
    { name: "Oct 1", openRate: 32.5, clickRate: 2.1 },
    { name: "Oct 3", openRate: 35.7, clickRate: 3.4 },
    { name: "Oct 6", openRate: 31.2, clickRate: 2.8 },
    { name: "Oct 9", openRate: 40.1, clickRate: 4.2 },
    { name: "Oct 12", openRate: 36.8, clickRate: 3.1 },
    { name: "Oct 15", openRate: 34.5, clickRate: 2.9 },
    { name: "Oct 18", openRate: 39.2, clickRate: 3.8 },
    { name: "Oct 21", openRate: 33.4, clickRate: 2.5 },
    { name: "Oct 24", openRate: 41.7, clickRate: 4.5 },
    { name: "Oct 27", openRate: 37.1, clickRate: 3.3 },
    { name: "Oct 30", openRate: 35.9, clickRate: 3.0 },

    // --- THÁNG 11 ---
    { name: "Nov 2", openRate: 38.4, clickRate: 3.9 },
    { name: "Nov 5", openRate: 42.1, clickRate: 4.8 },
    { name: "Nov 8", openRate: 34.2, clickRate: 2.7 },
    { name: "Nov 11", openRate: 39.8, clickRate: 4.1 },
    { name: "Nov 14", openRate: 43.5, clickRate: 5.2 },
    { name: "Nov 17", openRate: 36.1, clickRate: 3.4 },
    { name: "Nov 20", openRate: 38.7, clickRate: 3.6 },
    { name: "Nov 23", openRate: 40.2, clickRate: 4.0 },
    { name: "Nov 26", openRate: 33.9, clickRate: 2.8 },
    { name: "Nov 29", openRate: 41.3, clickRate: 4.4 },

    // --- THÁNG 12 ---
    { name: "Dec 2", openRate: 37.8, clickRate: 3.5 },
    { name: "Dec 5", openRate: 35.2, clickRate: 3.1 },
    { name: "Dec 8", openRate: 44.6, clickRate: 5.0 },
    { name: "Dec 11", openRate: 39.1, clickRate: 4.2 },
    { name: "Dec 14", openRate: 36.5, clickRate: 3.4 },
    { name: "Dec 15", openRate: 38.2, clickRate: 3.7 },
];
// --- COMPONENT: THẺ EMAIL PERFORMANCE (CÓ TABS) ---
function EmailPerformanceCard() {
    // State để quản lý nút nào đang được bấm ('openRate' hoặc 'clickRate')
    const [activeTab, setActiveTab] = useState<'openRate' | 'clickRate'>('openRate')

    return (
        <Card className="flex flex-col gap-0 rounded-xl border border-slate-800 bg-slate-950 py-0 text-slate-50 shadow-none overflow-hidden">
            {/* HEADER: Chia 2 nửa (Flex column trên Mobile, Row trên Desktop) */}
            <div className="flex flex-col items-stretch border-b border-slate-800 sm:flex-row">

                {/* Nửa trái: Tiêu đề */}
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle className="text-base font-semibold leading-none text-slate-200">Email Performance</CardTitle>
                    <CardDescription className="text-sm text-slate-400">Open and click rates for the last 3 months</CardDescription>
                </div>

                {/* Nửa phải: 2 Nút bấm (Tabs) */}
                <div className="flex">
                    {/* Nút 1: Open Rate */}
                    <button
                        type="button"
                        data-active={activeTab === 'openRate'}
                        onClick={() => setActiveTab('openRate')}
                        className="relative z-30 flex flex-1 cursor-pointer flex-col justify-center gap-1 border-t border-slate-800 px-6 py-4 text-left transition-colors hover:bg-slate-900/50 data-[active=true]:bg-slate-900 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                    >
                        <span className="text-xs text-slate-400">Open Rate</span>
                        <span className="text-base font-bold leading-none text-white sm:text-xl">35.7%</span>
                    </button>

                    {/* Nút 2: Click Rate */}
                    <button
                        type="button"
                        data-active={activeTab === 'clickRate'}
                        onClick={() => setActiveTab('clickRate')}
                        className="relative z-30 flex flex-1 cursor-pointer flex-col justify-center gap-1 border-t border-l border-slate-800 px-6 py-4 text-left transition-colors hover:bg-slate-900/50 data-[active=true]:bg-slate-900 sm:border-t-0 sm:px-8 sm:py-6"
                    >
                        <span className="text-xs text-slate-400">Click Rate</span>
                        <span className="text-base font-bold leading-none text-white sm:text-xl">3.4%</span>
                    </button>
                </div>
            </div>

            {/* CONTENT: Biểu đồ cột */}
            <div className="px-2 pb-4 pt-6 sm:px-6 sm:pb-6">
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockBarChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                            />
                            {/* Cột sẽ lấy dataKey tùy theo Tab nào đang active, và đổi màu tương ứng */}
                            <Bar
                                dataKey={activeTab}
                                fill={activeTab === 'openRate' ? "#3b82f6" : "#10b981"}
                                radius={[2, 2, 0, 0]} // Bo góc nhẹ ở đỉnh cột
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    )
}

export default function Dashboard() {
    return (
        // SidebarProvider bọc ngoài cùng
        <SidebarProvider>
            <div className="flex h-svh w-full overflow-hidden bg-slate-950">
                <AppSidebar />

                {/* Cấu trúc thay thế cho SidebarInset để kiểm soát scroll tuyệt đối */}
                <div className="relative flex flex-1 flex-col overflow-hidden bg-slate-950 text-slate-50">

                    {/* HEADER: Tách biệt hoàn toàn, không nằm trong vùng cuộn */}
                    <header className="z-30 flex h-14 shrink-0 items-center gap-2 border-b border-slate-800/50 bg-slate-950/80 px-4 backdrop-blur-sm sm:px-6 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1 text-slate-400 hover:text-white" />
                            <Separator orientation="vertical" className="mr-2 h-4 bg-slate-800" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#" className="text-slate-400 hover:text-white">Home</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block">
                                        <ChevronRight className="size-4 text-slate-500" />
                                    </BreadcrumbSeparator>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#" className="text-slate-400 hover:text-white">Nhat</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block">
                                        <ChevronRight className="size-4 text-slate-500" />
                                    </BreadcrumbSeparator>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="text-slate-200">Dashboard</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>

                    {/* VÙNG CHỨA NỘI DUNG: Ép flex-1 để nó chiếm trọn phần còn lại và khóa overflow */}
                    <div className="relative flex-1 overflow-hidden">
                        {/* SCROLL AREA của Shadcn: Chỉ cuộn đúng vùng này */}
                        <ScrollArea className="h-full w-full">
                            <main className="flex flex-col p-4 sm:px-6 sm:pt-6 sm:pb-24">
                                <div className="mx-auto w-full space-y-6">
                                    {/* Tiêu đề */}
                                    <div>
                                        <h1 className="font-bold text-lg sm:text-2xl">Dashboard</h1>
                                    </div>

                                    {/* Lưới StatCards */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                        <StatCard title="Emails Sent" value="7k" subtext="Total emails delivered" trend="18%" trendUp={true} />
                                        <StatCard title="Delivery Rate" value="99.3%" subtext="Successfully delivered" trend="2.3%" trendUp={true} />
                                        <StatCard title="Subscribers" value="8k" subtext="Active email list size" trend="12%" trendUp={true} />
                                        <StatCard title="Bounce Rate" value="1.8%" subtext="Failed deliveries" trend="-0.8%" trendUp={false} />
                                    </div>


                                    {/* AreaChart Card */}
                                    <Card className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950 py-6 shadow-none">
                                        <CardHeader className="px-6 pb-2 pt-0">
                                            <CardTitle className="text-base font-semibold text-slate-200">Emails Sent</CardTitle>
                                            <CardDescription className="text-sm text-slate-400">Email delivery breakdown for the last quarter</CardDescription>
                                        </CardHeader>
                                        <CardContent className="px-6 pb-0 h-64 w-full pt-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={mockAreaChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="fillMarketing" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                                                        </linearGradient>
                                                        <linearGradient id="fillTransactional" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                                                    {/* THÊM ĐƯỜNG LƯỚI NGANG Ở ĐÂY */}
                                                    <CartesianGrid stroke="#1e293b" vertical={false} strokeDasharray="3 3" />
                                                    <Area type="monotone" dataKey="transactional" stroke="#10b981" fillOpacity={1} fill="url(#fillTransactional)" />
                                                    <Area type="monotone" dataKey="marketing" stroke="#3b82f6" fillOpacity={1} fill="url(#fillMarketing)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>

                                    {/* Email Performance */}
                                    <EmailPerformanceCard />

                                </div>
                            </main>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    )
}