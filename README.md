#  Minesweeper Game

Een klassiek Minesweeper spel gebouwd met HTML, CSS en JavaScript, met drie moeilijkheidsniveaus en speciale effecten.


##  Features

- **Drie moeilijkheidsniveaus**:
  - Easy: 8×8 bord met 10 mijnen
  - Medium: 12×12 bord met 25 mijnen
  - Hard: 16×16 bord met 50 mijnen
- **Timer & Highscores**: Per niveau opgeslagen in localStorage
- Mijn-detectie met cijfers
-  Vlaggen plaatsen (rechtsklik)
- **Quick-loss herstel**: Automatische restart bij verlies binnen 1 seconde
- **Nieuwe record detectie**: Met extra confetti!
-  Responsief design
- Confetti animatie bij winnen
-  Geluidseffecten
-  Resetknop



## Installatie

1. Clone de repository:
   ```bash
   git clone https://github.com/Elinekempe/Minesweeper.git
   cd Minesweeper
   ```

2. Open `index.html` in je browser

## Gameplay

- **Links klikken**: Onthul een cel
- **Rechts klikken**: Plaats/verwijder een vlag
- **Doel**: Onthul alle cellen zonder op een mijn te klikken

## Architectuur

Het spel is gebouwd met de volgende componenten:

- `MinesweeperGame`: Hoofdklasse die alle logic coördineert
- `GameTimer`: Beheert de timer functionaliteit
- `HighscoreManager`: Opslag en validatie van highscores
- `UIRenderer`: Rendert het speelbord en berichten
- `AudioManager`: Abstract class voor win/lose geluiden
- `ConfettiEffect`: Beheert confetti animaties

## Auteur
Eline Kempe - [GitHub](https://github.com/Elinekempe)