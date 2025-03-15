"use client"
import { CalendarIcon, MapPinIcon, ClockIcon, Trash2 } from "lucide-react"

type Feature = {
    title: string
    dateAcquired: string
    location: string
    disposalDate: string
    image: string
}

interface LNFCardProps {
    feature: Feature
    onDelete: () => void
}

export function LNFMSCard({ feature, onDelete }: LNFCardProps) {
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
        <div className="flex flex-row overflow-hidden rounded-xl border border-border relative h-36">
            <div className="h-full aspect-square">
                {feature.image ? (
                    <img
                        src={feature.image || "/public/assets/image/noimg.gif"}
                        alt={feature.title}
                        className="h-full w-full object-cover object-center"
                    />
                ) : (
                    <img
                        src={"/public/assets/image/noimg.gif"}
                        alt={feature.title}
                        className="h-full w-full object-cover object-center"
                    />
                )}
            </div>
            <div className="px-4 py-3 flex-grow pr-8">
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
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
            <button
                onClick={onDelete}
                className="absolute right-3 top-3 p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                aria-label="삭제"
            >
                <Trash2 size={16} />
            </button>
        </div>
    )
}