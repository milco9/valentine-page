"use client"

import React, {useCallback, useEffect, useRef, useState} from "react"
import {Heart} from "lucide-react"
import {Button} from "@/components/ui/button"

interface FloatingHeart {
    id: number
    x: number
    y: number
    size: number
    delay: number
    duration: number
}

function FloatingHearts() {
    const [hearts, setHearts] = useState<FloatingHeart[]>([])

    useEffect(() => {
        const newHearts: FloatingHeart[] = Array.from({length: 50}, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 30 + 15,
            delay: Math.random() * 2,
            duration: Math.random() * 3 + 2,
        }))
        setHearts(newHearts)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {hearts.map((heart) => (
                <div
                    key={heart.id}
                    className="absolute animate-float"
                    style={{
                        left: `${heart.x}%`,
                        top: `${heart.y}%`,
                        animationDelay: `${heart.delay}s`,
                        animationDuration: `${heart.duration}s`,
                    }}
                >
                    <Heart
                        className="text-primary fill-primary"
                        style={{width: heart.size, height: heart.size}}
                    />
                </div>
            ))}
        </div>
    )
}

function BackgroundHearts() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {Array.from({length: 15}).map((_, i) => (
                <div
                    key={i}
                    className="absolute opacity-10 animate-pulse"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                    }}
                >
                    <Heart
                        className="text-primary fill-primary"
                        style={{width: Math.random() * 80 + 40, height: Math.random() * 80 + 40}}
                    />
                </div>
            ))}
        </div>
    )
}

export default function ValentinePage() {
    const [accepted, setAccepted] = useState(false)
    const [noButtonPosition, setNoButtonPosition] = useState({x: 0, y: 0})
    const [chaseCount, setChaseCount] = useState(0)
    const [isGone, setIsGone] = useState(false)
    const buttonContainerRef = useRef<HTMLDivElement>(null)

    const moveNoButton = useCallback(() => {
        if (isGone) return

        if (buttonContainerRef.current) {
            const container = buttonContainerRef.current.getBoundingClientRect()
            const buttonWidth = 100
            const buttonHeight = 50

            const maxX = container.width - buttonWidth
            const maxY = container.height - buttonHeight

            const newX = Math.random() * maxX
            const newY = Math.random() * maxY

            setNoButtonPosition({x: newX, y: newY})
            setChaseCount(prev => {
                const newCount = prev + 1
                if (newCount >= 8) {
                    setIsGone(true)
                }
                return newCount
            })
        }
    }, [isGone])

    const getOpacity = () => {
        if (isGone) return 0
        return Math.max(0, 1 - (chaseCount * 0.12))
    }

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (isGone || !buttonContainerRef.current) return

        const container = buttonContainerRef.current.getBoundingClientRect()
        const buttonX = container.left + (noButtonPosition.x || 140)
        const buttonY = container.top + (noButtonPosition.y || 40)
        const buttonWidth = 100
        const buttonHeight = 50

        const buttonCenterX = buttonX + buttonWidth / 2
        const buttonCenterY = buttonY + buttonHeight / 2

        const distance = Math.sqrt(
            Math.pow(e.clientX - buttonCenterX, 2) +
            Math.pow(e.clientY - buttonCenterY, 2)
        )

        if (distance < 100) {
            moveNoButton()
        }
    }, [isGone, noButtonPosition, moveNoButton])

    if (accepted) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <FloatingHearts/>
                <div className="text-center z-10 animate-in fade-in zoom-in duration-700">
                    <div className="mb-8 flex justify-center gap-4">
                        <Heart className="w-16 h-16 text-primary fill-primary animate-bounce"
                               style={{animationDelay: "0s"}}/>
                        <Heart className="w-20 h-20 text-accent fill-accent animate-bounce"
                               style={{animationDelay: "0.2s"}}/>
                        <Heart className="w-16 h-16 text-primary fill-primary animate-bounce"
                               style={{animationDelay: "0.4s"}}/>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
                        Jééééj!
                    </h1>
                    <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-4 text-balance">
                        {"Vedel som, že povieš áno!"}
                    </p>
                    <p className="text-2xl md:text-3xl lg:text-4xl text-primary font-semibold animate-pulse">
                        {"Ľúbim ťa! "}
                        <Heart className="inline w-8 h-8 fill-primary"/>
                    </p>
                    <div className="mt-12 space-y-2">
                        <p className="text-lg text-muted-foreground">{"Nemozem sa dočkať, až spolu dodatočne oslávime Valentína!"}</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <BackgroundHearts/>

            <div className="text-center z-10 max-w-2xl mx-auto">
                <div className="mb-8 flex justify-center">
                    <Heart className="w-20 h-20 md:w-28 md:h-28 text-primary fill-primary animate-pulse"/>
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance leading-tight">
                    Budeš moja Valentínka?
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground mb-12 text-balance">
                    {"Chcel som sa ťa opýtať niečo čpeciálne..."}
                </p>

                <div
                    ref={buttonContainerRef}
                    className="relative h-32 w-72 mx-auto"
                    onMouseMove={handleMouseMove}
                >
                    {/* Yes Button */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2">
                        <Button
                            onClick={() => setAccepted(true)}
                            size="lg"
                            className="text-xl px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-primary hover:bg-primary/90"
                        >
                            <Heart className="mr-2 w-5 h-5 fill-primary-foreground"/>
                            Áno!
                        </Button>
                    </div>

                    {/* No Button - Runs away and fades */}
                    {!isGone && (
                        <div
                            className="absolute transition-all duration-200 ease-out"
                            style={{
                                left: noButtonPosition.x || 140,
                                top: noButtonPosition.y || 40,
                                opacity: getOpacity(),
                            }}
                            onMouseEnter={moveNoButton}
                            onTouchStart={moveNoButton}
                        >
                            <Button
                                variant="outline"
                                size="lg"
                                className="text-lg px-6 py-5 rounded-full border-2 cursor-not-allowed hover:bg-secondary bg-transparent"
                            >
                                Nie
                            </Button>
                        </div>
                    )}
                </div>

                <p className="mt-12 text-sm text-muted-foreground italic">
                    {"(Napoveda: Je tu naozaj len jedna spravna odpoved...)"}
                </p>
            </div>
        </main>
    )
}
