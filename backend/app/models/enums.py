import enum

class PaymentMethodEnum(str, enum.Enum):
    bank_transfer = "bank_transfer"
    jazzcash = "jazzcash"
    easypaisa = "easypaisa"

class OrderStatusEnum(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"

class SystemTypeEnum(str, enum.Enum):
    on_grid = "on_grid"
    off_grid = "off_grid"
    hybrid = "hybrid"
