import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { ArrowUp, ArrowDown } from "lucide-react" // Import thêm 2 mũi tên xịn xò

// Data giả tạo độ nhấp nhô cho biểu đồ
export const mockChartData = [
    { value: 400 }, { value: 300 }, { value: 500 }, { value: 200 },
    { value: 600 }, { value: 400 }, { value: 700 }, { value: 500 }, { value: 800 }
]

export function StatCard({
    title,
    value,
    subtext,
    trend,
    trendUp
}: {
    title: string,
    value: string,
    subtext: string,
    trend: string,
    trendUp: boolean
}) {
    return (
        // Card bọc ngoài: màu nền đen nhánh, viền mỏng, bo góc tròn
        <Card className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950 py-6 text-slate-50 shadow-none">

            {/* HEADER: Chứa tiêu đề, mô tả và con số */}
            <CardHeader className="grid auto-rows-min items-start gap-1.5 px-6 pb-0">

                {/* Tiêu đề + Phần trăm */}
                <CardTitle className="font-semibold leading-none flex items-center gap-2.5 text-base text-slate-200">
                    <span>{title}</span>
                    <div>
                        <span className="inline-flex items-center justify-center py-0.5 text-xs w-fit whitespace-nowrap shrink-0 gap-1 rounded-md font-normal">
                            <span className={trendUp ? "text-green-500" : "text-red-500"}>
                                <span className="flex items-center space-x-1">
                                    {trendUp ? (
                                        <ArrowUp className="h-3 w-3" aria-hidden="true" />
                                    ) : (
                                        <ArrowDown className="h-3 w-3" aria-hidden="true" />
                                    )}
                                    <span>{trend}</span>
                                </span>
                            </span>
                        </span>
                    </div>
                </CardTitle>

                {/* Mô tả nhạt màu */}
                <CardDescription className="text-slate-400 text-sm">
                    {subtext}
                </CardDescription>

                {/* Con số to đùng */}
                <div className="pt-1">
                    <div className="font-bold text-2xl sm:text-3xl text-white">{value}</div>
                </div>
            </CardHeader>

            {/* CONTENT: Chứa đường line uốn lượn (Sparkline) */}
            <CardContent className="px-6 pb-0 pt-2">
                {/* Chỉnh aspect ratio để biểu đồ lùn và dài ra y hệt mẫu */}
                <div className="flex aspect-[2.5/1] w-full justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockChartData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6" // Màu xanh dương neon
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>

        </Card>
    )
}