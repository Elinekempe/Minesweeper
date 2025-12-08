// UML Klassendiagram voor Minesweeper
@startuml
class Game {
  - board: Cell[][]
  - revealed: boolean[][]
  - flagged: boolean[][]
  - rows: int
  - cols: int
  - mines: int
  - gameOver: boolean
  + init(size: string): void
  + placeMines(): void
  + calculateNumbers(): void
  + revealCell(x: int, y: int): void
  + checkWin(): boolean
  + showAllMines(): void
}

class Cell {
  - value: int | "M"
  - x: int
  - y: int
  + isMine(): boolean
  + getValue(): int
}

class UI {
  + renderBoard(): void
  + showWinMessage(): void
  + showLoseMessage(): void
}

class AudioManager {
  + playWin(): void
  + playLose(): void
}

class ConfettiEffect {
  + show(): void
}

class User {}

Game "1" o-- "*" Cell
Game "1" o-- "1" UI
UI "1" o-- "1" AudioManager
UI "1" o-- "1" ConfettiEffect
User --> UI : interacteert met
@enduml