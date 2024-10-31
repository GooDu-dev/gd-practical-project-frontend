import MinHeap from "@/utils/class/minheap"
import { Room } from "../maps/maps.interface"

export interface Route {
    visited: Uint8Array
    queue: [number, number][]
    start: Room | null
    target: Room | null
}

export interface Point {
    pos: [number, number]
    g: number
    f: number
}