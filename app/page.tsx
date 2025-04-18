'use client';

import { useState } from "react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Shirt, Tangent as Pants, Shovel as Shoe } from "lucide-react";

interface ClothingItem {
  id: string;
  type: "tops" | "bottoms" | "shoes";
  name: string;
  imageUrl: string;
  color: string;
  price: number;
}

const sampleWardrobe: ClothingItem[] = [
  {
    id: "1",
    type: "tops",
    name: "White T-Shirt",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    color: "white",
    price: 29.99
  },
  {
    id: "2",
    type: "tops",
    name: "Black Sweater",
    imageUrl: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400&h=400&fit=crop",
    color: "black",
    price: 49.99
  },
  {
    id: "3",
    type: "bottoms",
    name: "Blue Jeans",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop",
    color: "blue",
    price: 59.99
  },
  {
    id: "4",
    type: "bottoms",
    name: "Black Pants",
    imageUrl: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop",
    color: "black",
    price: 54.99
  },
  {
    id: "5",
    type: "shoes",
    name: "White Sneakers",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    color: "white",
    price: 79.99
  },
  {
    id: "6",
    type: "shoes",
    name: "Brown Boots",
    imageUrl: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400&h=400&fit=crop",
    color: "brown",
    price: 89.99
  },
  {
    id: "7",
    type: "tops",
    name: "Denim Jacket",
    imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&h=400&fit=crop",
    color: "blue",
    price: 69.99
  },
  {
    id: "8",
    type: "bottoms",
    name: "Khaki Chinos",
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop",
    color: "beige",
    price: 49.99
  },
  {
    id: "9",
    type: "shoes",
    name: "Black Oxford Shoes",
    imageUrl: "https://images.unsplash.com/photo-1614253429340-98120bd6d753?w=400&h=400&fit=crop",
    color: "black",
    price: 99.99
  }
];

const DraggableClothingItem = ({ item, onClick }: { item: ClothingItem; onClick: () => void }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: item.type,
    item: item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`cursor-move transition-transform hover:scale-105 ${isDragging ? 'opacity-50' : ''}`}
      onClick={onClick}
    >
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-full h-40 object-cover rounded-lg"
      />
      <div className="mt-2">
        <p className="text-sm font-medium">{item.name}</p>
        <p className="text-sm text-muted-foreground">${item.price}</p>
      </div>
    </div>
  );
};

const DroppableZone = ({ type, children, onDrop }: { type: string; children: React.ReactNode; onDrop: (item: ClothingItem) => void }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: type,
    drop: (item: ClothingItem) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`${isOver ? 'bg-accent' : ''} transition-colors`}
    >
      {children}
    </div>
  );
};

export default function Home() {
  const [selectedOutfit, setSelectedOutfit] = useState<{
    tops?: ClothingItem;
    bottoms?: ClothingItem;
    shoes?: ClothingItem;
  }>({});
  const [cartItems, setCartItems] = useState<ClothingItem[]>([]);

  const selectItem = (item: ClothingItem) => {
    setSelectedOutfit(prev => ({
      ...prev,
      [item.type]: item
    }));
  };

  const addToCart = () => {
    const items = Object.values(selectedOutfit).filter(Boolean) as ClothingItem[];
    setCartItems(prev => [...prev, ...items]);
    setSelectedOutfit({});
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Outfit Builder</h1>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              <span className="font-semibold">${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Outfit Display */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Current Outfit</h2>
              <div className="space-y-4">
                <DroppableZone type="tops" onDrop={selectItem}>
                  <div className="flex items-center gap-4">
                    <Shirt className="w-8 h-8" />
                    {selectedOutfit.tops ? (
                      <div className="flex-1">
                        <img 
                          src={selectedOutfit.tops.imageUrl} 
                          alt={selectedOutfit.tops.name}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <p className="mt-2 text-sm font-medium">${selectedOutfit.tops.price}</p>
                      </div>
                    ) : (
                      <div className="flex-1 h-32 bg-muted rounded-lg flex items-center justify-center">
                        Drag a top here
                      </div>
                    )}
                  </div>
                </DroppableZone>
                
                <DroppableZone type="bottoms" onDrop={selectItem}>
                  <div className="flex items-center gap-4">
                    <Pants className="w-8 h-8" />
                    {selectedOutfit.bottoms ? (
                      <div className="flex-1">
                        <img 
                          src={selectedOutfit.bottoms.imageUrl} 
                          alt={selectedOutfit.bottoms.name}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <p className="mt-2 text-sm font-medium">${selectedOutfit.bottoms.price}</p>
                      </div>
                    ) : (
                      <div className="flex-1 h-32 bg-muted rounded-lg flex items-center justify-center">
                        Drag bottoms here
                      </div>
                    )}
                  </div>
                </DroppableZone>
                
                <DroppableZone type="shoes" onDrop={selectItem}>
                  <div className="flex items-center gap-4">
                    <Shoe className="w-8 h-8" />
                    {selectedOutfit.shoes ? (
                      <div className="flex-1">
                        <img 
                          src={selectedOutfit.shoes.imageUrl} 
                          alt={selectedOutfit.shoes.name}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <p className="mt-2 text-sm font-medium">${selectedOutfit.shoes.price}</p>
                      </div>
                    ) : (
                      <div className="flex-1 h-32 bg-muted rounded-lg flex items-center justify-center">
                        Drag shoes here
                      </div>
                    )}
                  </div>
                </DroppableZone>
                
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedOutfit({})}
                  >
                    Clear Outfit
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={addToCart}
                    disabled={Object.keys(selectedOutfit).length === 0}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>

            {/* Wardrobe Selection */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Wardrobe</h2>
              <Tabs defaultValue="tops" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tops">Tops</TabsTrigger>
                  <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
                  <TabsTrigger value="shoes">Shoes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="tops" className="grid grid-cols-2 gap-4">
                  {sampleWardrobe
                    .filter(item => item.type === "tops")
                    .map(item => (
                      <DraggableClothingItem
                        key={item.id}
                        item={item}
                        onClick={() => selectItem(item)}
                      />
                    ))}
                </TabsContent>
                
                <TabsContent value="bottoms" className="grid grid-cols-2 gap-4">
                  {sampleWardrobe
                    .filter(item => item.type === "bottoms")
                    .map(item => (
                      <DraggableClothingItem
                        key={item.id}
                        item={item}
                        onClick={() => selectItem(item)}
                      />
                    ))}
                </TabsContent>
                
                <TabsContent value="shoes" className="grid grid-cols-2 gap-4">
                  {sampleWardrobe
                    .filter(item => item.type === "shoes")
                    .map(item => (
                      <DraggableClothingItem
                        key={item.id}
                        item={item}
                        onClick={() => selectItem(item)}
                      />
                    ))}
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}