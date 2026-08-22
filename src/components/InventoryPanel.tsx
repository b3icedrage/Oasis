/**
 * InventoryPanel — Full-screen inventory overlay
 *
 * Displays all items with rarity colors, equip/unequip weapons, use consumables.
 * Mirrors Unity's ScriptableObject-based inventory UI.
 */
import type { PlayerEntity, GameItem, WeaponItem, ConsumableItem } from '../game/core/types';
import { ItemRarity, RARITY_COLORS } from '../game/core/types';
import { equipWeapon, useConsumable, MAX_INVENTORY } from '../game/systems/InventorySystem';

interface InventoryPanelProps {
  player: PlayerEntity;
  onClose: () => void;
  onUpdate: () => void;
}

/** Rarity badge component */
function RarityBadge({ rarity }: { rarity: ItemRarity }) {
  const colors: Record<ItemRarity, string> = {
    [ItemRarity.Common]: 'bg-gray-600 text-gray-200',
    [ItemRarity.Rare]: 'bg-blue-900 text-blue-300',
    [ItemRarity.Epic]: 'bg-purple-900 text-purple-300',
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${colors[rarity]}`}>
      {rarity}
    </span>
  );
}

/** Single item card */
function ItemCard({
  item,
  onEquip,
  onUse,
  isEquipped,
}: {
  item: GameItem;
  onEquip?: () => void;
  onUse?: () => void;
  isEquipped?: boolean;
}) {
  return (
    <div
      className={`relative bg-black/40 rounded-lg p-2.5 border transition-all hover:bg-white/10 cursor-pointer
        ${isEquipped ? 'border-yellow-400 ring-1 ring-yellow-400/50' : 'border-white/10'}`}
      style={{ borderColor: RARITY_COLORS[item.rarity] + '40' }}
    >
      {isEquipped && (
        <div className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-black text-[9px] font-bold px-1 rounded">
          EQUIPPED
        </div>
      )}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{item.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-white text-xs font-bold truncate">{item.name}</div>
          <RarityBadge rarity={item.rarity} />
        </div>
      </div>
      <p className="text-gray-400 text-[10px] leading-tight mb-2">{item.description}</p>

      {/* Stats */}
      {item.type === 'weapon' && (
        <div className="text-yellow-400 text-[10px] font-bold">+{(item as WeaponItem).attackBonus} ATK</div>
      )}
      {item.type === 'armor' && (
        <div className="text-blue-400 text-[10px] font-bold">
          +{(item as any).defenseBonus} DEF
        </div>
      )}
      {item.type === 'consumable' && (
        <div className="text-green-400 text-[10px] font-bold">
          +{(item as ConsumableItem).healAmount} HP
        </div>
      )}

      {/* Action button */}
      <div className="mt-2">
        {item.type === 'weapon' && (
          <button
            onClick={(e) => { e.stopPropagation(); onEquip?.(); }}
            className="w-full bg-yellow-600/80 hover:bg-yellow-500 text-black text-[10px] font-bold 
                       py-1 rounded transition-colors"
          >
            {isEquipped ? 'UNEQUIP' : 'EQUIP'}
          </button>
        )}
        {item.type === 'consumable' && (
          <button
            onClick={(e) => { e.stopPropagation(); onUse?.(); }}
            className="w-full bg-green-600/80 hover:bg-green-500 text-white text-[10px] font-bold 
                       py-1 rounded transition-colors"
          >
            USE
          </button>
        )}
      </div>
    </div>
  );
}

export function InventoryPanel({ player, onClose, onUpdate }: InventoryPanelProps) {
  const handleEquip = (weapon: WeaponItem) => {
    equipWeapon(player, weapon);
    onUpdate();
  };

  const handleUse = (item: ConsumableItem) => {
    useConsumable(player, item);
    onUpdate();
  };

  // Sort items by rarity then type
  const sortedItems = [...player.inventory].sort((a, b) => {
    const rarityOrder: Record<ItemRarity, number> = {
      [ItemRarity.Epic]: 0,
      [ItemRarity.Rare]: 1,
      [ItemRarity.Common]: 2,
    };
    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
  });

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900/95 rounded-2xl border border-white/10 p-4 max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-lg">🎒 Inventory</h2>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs">
              {player.inventory.length}/{MAX_INVENTORY}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Equipped weapon */}
        {player.equippedWeapon && (
          <div className="mb-3 p-2 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
            <div className="text-yellow-400 text-[10px] font-bold uppercase mb-1">
              ⚔️ Equipped Weapon
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{player.equippedWeapon.icon}</span>
              <div>
                <span className="text-white text-sm font-bold">{player.equippedWeapon.name}</span>
                <span className="text-yellow-400 text-xs ml-2">
                  +{player.equippedWeapon.attackBonus} ATK
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Item grid */}
        <div className="flex-1 overflow-y-auto">
          {sortedItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-sm">Your inventory is empty.</p>
              <p className="text-xs text-gray-600">Defeat enemies to collect loot!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {sortedItems.map((item, idx) => (
                <ItemCard
                  key={`${item.id}_${idx}`}
                  item={item}
                  isEquipped={
                    item.type === 'weapon' && player.equippedWeapon?.id === item.id
                  }
                  onEquip={() => item.type === 'weapon' && handleEquip(item as WeaponItem)}
                  onUse={() => item.type === 'consumable' && handleUse(item as ConsumableItem)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 text-center">
          <span className="text-gray-500 text-[10px]">Press I or tap ✕ to close</span>
        </div>
      </div>
    </div>
  );
}
