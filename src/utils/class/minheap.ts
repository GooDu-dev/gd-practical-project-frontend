class MinHeap {

    private heap: any[];

    constructor() {
        this.heap = [];
    }

    push(node: any) {
        this.heap.push(node);
        this._bubbleUp();
    }

    pop() {
        if (this.heap.length < 2) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this._sinkDown();
        return min;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    _bubbleUp() {
        let index = this.heap.length - 1;
        const element = this.heap[index];
        
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            let parent = this.heap[parentIndex];
            
            if (element.f >= parent.f) break;

            this.heap[index] = parent;
            index = parentIndex;
        }
        this.heap[index] = element;
    }

    _sinkDown() {
        let index = 0;
        const length = this.heap.length;
        const element = this.heap[0];
        
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let swapIndex = null;

            if (leftChildIndex < length) {
                let leftChild = this.heap[leftChildIndex];
                if (leftChild.f < element.f) {
                    swapIndex = leftChildIndex;
                }
            }

            if (rightChildIndex < length) {
                let rightChild = this.heap[rightChildIndex];
                if (
                    (swapIndex === null && rightChild.f < element.f) ||
                    (swapIndex !== null && rightChild.f < this.heap[swapIndex].f)
                ) {
                    swapIndex = rightChildIndex;
                }
            }

            if (swapIndex === null) break;

            this.heap[index] = this.heap[swapIndex];
            index = swapIndex;
        }
        this.heap[index] = element;
    }
}

export default MinHeap