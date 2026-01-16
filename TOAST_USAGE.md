# Toast System Documentation

## Описание

Система toast уведомлений с использованием FrameComponent. Поддерживает множественные уведомления с красивой анимацией появления и исчезновения.

## Использование

### Базовое использование

```javascript
// В любом компоненте Vue без импортов
this.$toast.show('Привет, мир!')
```

### Типы уведомлений

```javascript
// Информационное (синее)
this.$toast.info('Информационное сообщение')

// Успех (зеленое)
this.$toast.success('Операция выполнена успешно!')

// Ошибка (красное, отображается 5 секунд)
this.$toast.error('Произошла ошибка!')

// Предупреждение (золотое)
this.$toast.warning('Внимание!')
```

### Дополнительные опции

```javascript
// Кастомная длительность (в миллисекундах)
this.$toast.show('Это сообщение', { duration: 5000 })

// Бесконечное отображение (duration: 0)
this.$toast.show('Нажмите для закрытия', { duration: 0 })

// Другой тип фрейма
this.$toast.success('Успех!', { 
  frameType: 'vertical-card',
  duration: 4000 
})

// Комбинация опций
this.$toast.error('Критическая ошибка', {
  duration: 10000,
  frameType: 'game-big'
})
```

### Программное управление

```javascript
// Очистить все уведомления
this.$toast.clear()

// Получить ID уведомления для последующего удаления
const toastId = this.$toast.show('Загрузка...')
// ... позже
this.$toast.remove(toastId) // через store
```

## Доступные типы фреймов

- `generic-card-horizontal` (по умолчанию)
- `vertical-card`
- `game-big`
- `game-small-horizontal`
- `game-small-vertical`
- и другие из FrameComponent

## Примеры в реальных сценариях

```javascript
// При успешном входе
methods: {
  async login() {
    try {
      await this.authStore.login(credentials)
      this.$toast.success('Вход выполнен успешно!')
      this.$router.push('/game')
    } catch (error) {
      this.$toast.error('Неверный логин или пароль')
    }
  }
}

// При покупке предмета
async buyItem(item) {
  const result = await this.shopStore.purchase(item.id)
  if (result.success) {
    this.$toast.success(`Куплен предмет: ${item.name}`)
  } else {
    this.$toast.error('Недостаточно монет')
  }
}

// Множественные уведомления
this.$toast.info('Начинается бой...')
setTimeout(() => {
  this.$toast.success('Враг повержен!', { frameType: 'game-big' })
}, 2000)
```

## Особенности

- ✅ Автоматическое закрытие через 3 секунды (по умолчанию)
- ✅ Закрытие по клику на уведомление
- ✅ Плавная анимация появления и исчезновения
- ✅ Поддержка множественных уведомлений
- ✅ TransitionGroup для плавного перемещения
- ✅ Адаптивная верстка
- ✅ Использование игровых фреймов
- ✅ Эффект при наведении
