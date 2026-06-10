from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
Base = declarative_base()
class TradeSignal(Base):
__tablename__ = 'trade_signals'
id = Column(Integer, primary_key=True, index=True)
timestamp = Column(DateTime, default=datetime.utcnow, index=True)
symbol = Column(String(50), nullable=False)
signal_type = Column(String(10), nullable=False) # BUY / SELL
strategy_name = Column(String(50), nullable=False)
trigger_price = Column(Float, nullable=False)
execution_status = Column(String(20), default="PENDING") # EXECUTED, FAILED
class LivePosition(Base):
__tablename__ = 'live_positions'
id = Column(Integer, primary_key=True, index=True)
symbol = Column(String(50), unique=True, nullable=False)
quantity = Column(Integer, nullable=False)
average_price = Column(Float, nullable=False)
current_price = Column(Float, nullable=False)
unrealized_pnl = Column(Float, default=0.0)
is_active = Column(Boolean, default=True)
last_updated = Column(DateTime, default=datetime.utcnow)
