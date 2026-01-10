// Утилиты для работы с предметами

// Размеры предметов [ширина, высота]
const ITEM_SIZES = {
  amulet: [1, 1],
  belt: [2, 2],
  blades: [1, 2],
  blade_and_shield: [2, 2],
  chest: [2, 2],
  cloak: [2, 2],
  mantle: [2, 2],
  ring: [1, 1],
  staff: [1, 2]
}

/**
 * Извлекает тип предмета из пути к изображению
 * @param {string} photoPath - Путь к изображению, например "static/items/belt/belt_tier3_1.png"
 * @returns {string|null} - Тип предмета или null
 */
export function getItemTypeFromPhoto(photoPath) {
  if (!photoPath) return null
  
  const match = photoPath.match(/static\/items\/([^/]+)\//)
  return match ? match[1] : null
}

/**
 * Получает размер предмета на основе его типа
 * @param {string} itemType - Тип предмета
 * @returns {[number, number]} - Массив [ширина, высота]
 */
export function getItemSize(itemType) {
  return ITEM_SIZES[itemType] || [1, 1]
}

/**
 * Преобразует предмет из API в формат для UI
 * @param {Object} apiItem - Предмет из API
 * @returns {Object} - Предмет в формате UI
 */
export function transformApiItem(apiItem) {
  if (!apiItem) return null
  
  const itemType = getItemTypeFromPhoto(apiItem.photo)
  const size = getItemSize(itemType)
  
  return {
    id: apiItem.id,
    name: apiItem.name,
    description: apiItem.description,
    photo: apiItem.photo,
    price: apiItem.price,
    isEquipped: apiItem.is_equipped,
    type: itemType,
    size: size,
    stats: apiItem.stats?.map(stat => ({
      label: formatStatLabel(stat),
      value: formatStatValue(stat),
      buffSkill: stat.buff_skill,
      buffType: stat.buff_type,
      currentValue: stat.current_value,
      maxValue: stat.max_value,
      minValue: stat.min_value,
      tier: stat.tier
    })) || [],
    position: {
      x: apiItem.x_pos || 0,
      y: apiItem.y_pos || 0
    }
  }
}

/**
 * Форматирует метку стата для отображения
 * @param {Object} stat - Объект стата
 * @returns {string} - Отформатированная метка
 */
function formatStatLabel(stat) {
  const skillNames = {
    Defence: 'Defense',
    AllAttributes: 'All Attributes',
    Health: 'Health',
    Mana: 'Mana',
    Strength: 'Strength',
    Agility: 'Agility',
    Intellect: 'Intellect',
    CritChance: 'Crit Chance',
    CritDamage: 'Crit Damage',
    Armor: 'Armor',
    Damage: 'Damage'
  }
  
  const skillName = skillNames[stat.buff_skill] || stat.buff_skill
  const typePrefix = stat.buff_type === 'M' ? '+' : '+'
  
  return `${typePrefix} ${skillName}`
}

/**
 * Форматирует значение стата для отображения
 * @param {Object} stat - Объект стата
 * @returns {string} - Отформатированное значение
 */
function formatStatValue(stat) {
  const value = stat.current_value
  
  if (stat.buff_type === 'M' || stat.buff_type === 'flatM') {
    return `${value}%`
  }
  
  return `${value}`
}

/**
 * Преобразует предмет из UI обратно в формат API для обновления
 * @param {Object} uiItem - Предмет в формате UI
 * @returns {Object} - Данные для отправки в API
 */
export function transformItemForApi(uiItem) {
  return {
    is_equipped: uiItem.isEquipped,
    x_pos: uiItem.position?.x || 0,
    y_pos: uiItem.position?.y || 0,
    stats_data: uiItem.stats?.map(stat => ({
      item_stat_id: stat.id,
      current_value: stat.currentValue,
      visual_text: `${stat.label} ${stat.value}`
    }))
  }
}

/**
 * Вычисляет индекс слота на основе позиции x, y
 * @param {number} x - Позиция X (колонка)
 * @param {number} y - Позиция Y (строка)
 * @param {number} cols - Количество колонок в сетке (по умолчанию 8)
 * @returns {number} - Индекс слота
 */
export function positionToIndex(x, y, cols = 8) {
  return y * cols + x
}

/**
 * Вычисляет позицию x, y на основе индекса слота
 * @param {number} index - Индекс слота
 * @param {number} cols - Количество колонок в сетке (по умолчанию 8)
 * @returns {{x: number, y: number}} - Позиция в сетке
 */
export function indexToPosition(index, cols = 8) {
  return {
    x: index % cols,
    y: Math.floor(index / cols)
  }
}

/**
 * Проверяет, можно ли поместить предмет в указанную позицию
 * @param {Object} item - Предмет для размещения
 * @param {number} targetX - Целевая позиция X
 * @param {number} targetY - Целевая позиция Y
 * @param {Array} occupiedSlots - Массив занятых позиций
 * @param {number} gridCols - Количество колонок
 * @param {number} gridRows - Количество строк
 * @returns {boolean} - Можно ли разместить
 */
export function canPlaceItem(item, targetX, targetY, occupiedSlots, gridCols = 8, gridRows = 8) {
  if (!item || !item.size) return false
  
  const [width, height] = item.size
  
  // Проверка выхода за границы
  if (targetX + width > gridCols || targetY + height > gridRows) {
    return false
  }
  
  // Проверка пересечения с другими предметами
  for (let y = targetY; y < targetY + height; y++) {
    for (let x = targetX; x < targetX + width; x++) {
      const slotIndex = positionToIndex(x, y, gridCols)
      if (occupiedSlots.includes(slotIndex)) {
        return false
      }
    }
  }
  
  return true
}
