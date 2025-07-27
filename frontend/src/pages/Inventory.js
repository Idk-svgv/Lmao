import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { mockInventory, getRarityColor, getRarityGlow } from "../mock/mockData";
import { 
  Sword, 
  Shield, 
  Gem, 
  Zap, 
  Package,
  Star,
  Trash2,
  ShoppingCart
} from "lucide-react";

const Inventory = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [equippedItems, setEquippedItems] = useState({
    weapon: mockInventory.weapons.find(w => w.equipped),
    armor: mockInventory.armor.find(a => a.equipped),
    accessories: mockInventory.accessories.filter(a => a.equipped)
  });

  const handleEquip = (item, category) => {
    // Mock equip functionality
    if (category === 'weapons') {
      setEquippedItems(prev => ({
        ...prev,
        weapon: item
      }));
    } else if (category === 'armor') {
      setEquippedItems(prev => ({
        ...prev,
        armor: item
      }));
    } else if (category === 'accessories') {
      setEquippedItems(prev => ({
        ...prev,
        accessories: [item]
      }));
    }
  };

  const ItemCard = ({ item, category, isEquipped }) => (
    <div 
      className={`p-4 bg-gray-800 rounded-lg border-2 transition-all cursor-pointer hover:scale-105 ${
        isEquipped ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700'
      } ${getRarityGlow(item.rarity)}`}
      onClick={() => setSelectedItem(item)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-semibold ${getRarityColor(item.rarity)}`}>
          {item.name}
        </h3>
        <Badge variant="outline" className={getRarityColor(item.rarity)}>
          {item.rarity}
        </Badge>
      </div>
      
      <div className="space-y-1 text-sm">
        <div className="text-gray-400">Type: {item.type}</div>
        {item.attack && (
          <div className="text-red-400">Attack: {item.attack}</div>
        )}
        {item.defense && (
          <div className="text-blue-400">Defense: {item.defense}</div>
        )}
        {item.effect && (
          <div className="text-green-400">Effect: {item.effect}</div>
        )}
        {item.durability && (
          <div className="text-yellow-400">Durability: {item.durability}%</div>
        )}
        {item.quantity && (
          <div className="text-gray-400">Quantity: {item.quantity}</div>
        )}
      </div>
      
      {isEquipped && (
        <Badge className="mt-2 bg-purple-600">
          Equipped
        </Badge>
      )}
    </div>
  );

  const ItemDetails = ({ item }) => (
    <Card className="bg-gray-800 border-gray-700 sticky top-0">
      <CardHeader>
        <CardTitle className={`text-white ${getRarityColor(item.rarity)}`}>
          {item.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={getRarityColor(item.rarity)}>
            {item.rarity}
          </Badge>
          <Badge variant="outline">
            {item.type}
          </Badge>
        </div>
        
        <div className="space-y-2">
          {item.attack && (
            <div className="flex justify-between">
              <span className="text-gray-400">Attack Power</span>
              <span className="text-red-400 font-bold">{item.attack}</span>
            </div>
          )}
          {item.defense && (
            <div className="flex justify-between">
              <span className="text-gray-400">Defense</span>
              <span className="text-blue-400 font-bold">{item.defense}</span>
            </div>
          )}
          {item.effect && (
            <div className="flex justify-between">
              <span className="text-gray-400">Effect</span>
              <span className="text-green-400">{item.effect}</span>
            </div>
          )}
          {item.durability && (
            <div className="flex justify-between">
              <span className="text-gray-400">Durability</span>
              <span className="text-yellow-400">{item.durability}%</span>
            </div>
          )}
          {item.quantity && (
            <div className="flex justify-between">
              <span className="text-gray-400">Quantity</span>
              <span className="text-gray-300">{item.quantity}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {!item.equipped && (
            <Button 
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={() => handleEquip(item, 'weapons')}
            >
              Equip
            </Button>
          )}
          {item.equipped && (
            <Button variant="outline" className="flex-1">
              Unequip
            </Button>
          )}
          <Button variant="outline" size="icon">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Inventory</h1>
        <div className="flex items-center space-x-4">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Shop
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Inventory Tabs */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="weapons" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="weapons" className="flex items-center">
                <Sword className="w-4 h-4 mr-2" />
                Weapons
              </TabsTrigger>
              <TabsTrigger value="armor" className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Armor
              </TabsTrigger>
              <TabsTrigger value="accessories" className="flex items-center">
                <Gem className="w-4 h-4 mr-2" />
                Accessories
              </TabsTrigger>
              <TabsTrigger value="consumables" className="flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Consumables
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weapons" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {mockInventory.weapons.map((weapon) => (
                  <ItemCard 
                    key={weapon.id} 
                    item={weapon} 
                    category="weapons"
                    isEquipped={weapon.equipped}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="armor" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {mockInventory.armor.map((armor) => (
                  <ItemCard 
                    key={armor.id} 
                    item={armor} 
                    category="armor"
                    isEquipped={armor.equipped}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="accessories" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {mockInventory.accessories.map((accessory) => (
                  <ItemCard 
                    key={accessory.id} 
                    item={accessory} 
                    category="accessories"
                    isEquipped={accessory.equipped}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="consumables" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {mockInventory.consumables.map((consumable) => (
                  <ItemCard 
                    key={consumable.id} 
                    item={consumable} 
                    category="consumables"
                    isEquipped={false}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Item Details */}
        <div className="lg:col-span-1">
          {selectedItem ? (
            <ItemDetails item={selectedItem} />
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select an item to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;