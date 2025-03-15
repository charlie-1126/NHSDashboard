"use client"
import { CalendarIcon, MapPinIcon, ClockIcon } from "lucide-react"

type Feature = {
    title: string
    dateAcquired: string
    location: string
    disposalDate: string
    image: string
}

interface LNFCardProps {
    feature: Feature
}

export function LNFCard({ feature }: LNFCardProps) {
    // Format dates to be more readable
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })
    }

    // Calculate days remaining until disposal
    const getDaysRemaining = () => {
        const today = new Date()
        const disposalDate = new Date(feature.disposalDate)
        const diffTime = disposalDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const daysRemaining = getDaysRemaining()

    return (
        <div className="flex flex-col overflow-clip rounded-xl border border-border h-full flex-grow">
            <div className="relative w-full h-7/10 overflow-hidden">
                {feature.image ? (
                    <img
                        src={feature.image || "public/assets/image/noimg.gif"}
                        alt={feature.title}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                ) : (
                    <img
                        src="public/assets/image/noimg.gif"
                        alt={feature.title}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                )}
            </div>
            <div className="px-4 py-4 md:px-5 md:py-5 flex-grow">
                <h3 className="mb-2 text-lg font-semibold md:text-xl">{feature.title}</h3>
                <div className="space-y-1 text-muted-foreground text-sm">
                    <p className="flex items-center">
                        <CalendarIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        <span>
                            <strong>취득 일자:</strong> {formatDate(feature.dateAcquired)}
                        </span>
                    </p>
                    <p className="flex items-center">
                        <MapPinIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        <span>
                            <strong>취득 장소:</strong> {feature.location}
                        </span>
                    </p>
                    <p className="flex items-center">
                        <ClockIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        <span className={daysRemaining <= 3 ? "text-red-500" : ""}>
                            <strong>폐기 일자:</strong> {formatDate(feature.disposalDate)}
                            <span className="ml-1 font-medium">({daysRemaining}일 남음)</span>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}