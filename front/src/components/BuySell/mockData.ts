export interface CardItem {
    id: string;
    name: string;
    price: number;
    imageNum: string;
    type: string;
}

export const mockItems: CardItem[] = [
    { id: "1", name: "Mega Venusaur", price: 50000, imageNum: "001", type: "Grass" },
    { id: "2", name: "Mega Charizard X", price: 120000, imageNum: "004", type: "Fire" },
    { id: "3", name: "Mega Blastoise", price: 85000, imageNum: "007", type: "Water" },
    { id: "4", name: "Beedrill", price: 15000, imageNum: "010", type: "Bug" },
];

export const availableCards = [
    { id: "001", name: "Venusaur" },
    { id: "002", name: "Ivysaur" },
    { id: "003", name: "Bulbasaur" },
    { id: "004", name: "Charizard" },
    { id: "005", name: "Charmeleon" },
    { id: "006", name: "Charmander" },
];
