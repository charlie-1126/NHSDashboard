"use client"

import { useState, useEffect } from "react"
import { LNFCard } from '../components/ui/LNF_card'
import { Card, CardContent, CardHeader, CardTitle } from "..//components/ui/card"
import { Separator } from "../components/ui/separator"

const items = [
  {
    title: "갤럭시 버즈3 프로",
    dateAcquired: "2025-03-13",
    location: "2-4",
    disposalDate: "2025-03-27",
    image: "https://url.kr/cqi4sj",
  },
  {
    title: "아이폰 15",
    dateAcquired: "2025-03-10",
    location: "3-2",
    disposalDate: "2025-03-25",
    image: "https://blog.kakaocdn.net/dn/cZIUet/btsEGiAfpmX/xiFZZnhWZJQwlrNKW8fPX1/img.jpg",
  },
  {
    title: "태블릿 X",
    dateAcquired: "2025-03-05",
    location: "1-1",
    disposalDate: "2025-03-20",
    image: "",
  },
  {
    title: "스마트워치 Z",
    dateAcquired: "2025-03-01",
    location: "4-3",
    disposalDate: "2025-03-15",
    image: "",
  },
]

export function Main() {
  const itemsPerPage = 3
  // 전체 페이지 수 계산 (총 항목이 3의 배수가 아니면 마지막 페이지는 남은 항목만)
  const totalPages = Math.ceil(items.length / itemsPerPage)

  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    if (totalPages <= 1) return // 항목이 3개 이하인 경우 페이지 전환 없이 그대로 표시
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages)
    }, 5000)
    return () => clearInterval(interval)
  }, [totalPages])

  // 현재 페이지에 해당하는 항목들만 표시
  const currentItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  return (
    <div className="p-4 flex flex-col h-screen min-h-0">
      <div className="flex flex-col md:flex-row gap-4 flex-grow h-full">
        {/* LNF 영역 */}
        <div className="flex-grow md:w-7/10 h-full">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>분실물 안내 (LNF)</CardTitle>
            </CardHeader>
            <CardContent className="h-full flex flex-col">
              {/* 카드를 가로로 3개씩 배치 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-full">
                {currentItems.map((item, index) => (
                  <LNFCard key={index} feature={item} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-1">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full ${currentPage === index ? "bg-primary" : "bg-gray-200"}`}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 구분선 (모바일에서는 수평선, 데스크톱에서는 수직선) */}
        <div className="hidden md:block">
          <Separator orientation="vertical" className="h-full" />
        </div>
        <Separator className="md:hidden my-4" />

        {/* Meal 영역 */}
        <div className="md:w-3/10">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>오늘의 식단</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mb-2">조식</h3>
              <Card>
                <CardContent>
                  <p>쌀밥</p>
                  <p>돈육김치찌개 (5.9.10)</p>
                  <p>볼어묵야채볶음 (1.5.6)</p>
                  <p>오이무침 (5.6.13)</p>
                  <p>치즈달걀말이 (1.2.5)</p>
                  <p>소품떡/소스 (2.5.6.10.12.13.15.16)</p>
                  <p>돌산갓김치 (9)</p>
                  <p>짜먹는요구르트(딸기) (2)</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}