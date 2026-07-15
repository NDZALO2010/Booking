from datetime import datetime
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title='Booking API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://127.0.0.1:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


class CreditHistoryItem(BaseModel):
    id: int
    holder: str
    amount: float
    timestamp: str


class CreditSummary(BaseModel):
    holder: str
    balance: float
    history: List[CreditHistoryItem]


class CreditLoadRequest(BaseModel):
    holder: str = Field(min_length=1)
    amount: float = Field(gt=0)


class DepartureItem(BaseModel):
    tripId: int
    route: str
    stop: str
    time: str


class ArrivalItem(BaseModel):
    tripId: int
    route: str
    destination: str
    time: str


class ScheduleResponse(BaseModel):
    departures: List[DepartureItem]
    arrivals: List[ArrivalItem]


class TicketItem(BaseModel):
    id: int
    route: str
    name: str
    detail: str
    fare: str
    remaining: int
    soldOut: bool


class TicketsResponse(BaseModel):
    items: List[TicketItem]


credit_balance = 38.0
credit_holder = 'Jordan Lee'
credit_history = [
    CreditHistoryItem(id=1, holder='Jordan Lee', amount=20.0, timestamp='2026-07-14 08:20'),
    CreditHistoryItem(id=2, holder='Jordan Lee', amount=18.0, timestamp='2026-07-15 07:15'),
]


@app.get('/api/health')
def health() -> dict:
    return {'status': 'ok'}


@app.get('/api/credits', response_model=CreditSummary)
def get_credits() -> CreditSummary:
    return CreditSummary(holder=credit_holder, balance=credit_balance, history=list(reversed(credit_history)))


@app.post('/api/credits/load', response_model=CreditSummary)
def load_credits(payload: CreditLoadRequest) -> CreditSummary:
    global credit_balance, credit_holder, credit_history

    credit_holder = payload.holder.strip()
    credit_balance += payload.amount
    credit_history.append(
        CreditHistoryItem(
            id=len(credit_history) + 1,
            holder=credit_holder,
            amount=payload.amount,
            timestamp=datetime.now().strftime('%Y-%m-%d %H:%M'),
        )
    )
    return get_credits()


@app.get('/api/schedule', response_model=ScheduleResponse)
def get_schedule() -> ScheduleResponse:
    return ScheduleResponse(
        departures=[
            DepartureItem(tripId=101, route='Route A', stop='Central Station', time='08:30 AM'),
            DepartureItem(tripId=102, route='Route B', stop='North Loop', time='09:05 AM'),
            DepartureItem(tripId=103, route='Route C', stop='South Market', time='09:40 AM'),
        ],
        arrivals=[
            ArrivalItem(tripId=201, route='Route A', destination='Airport Terminal', time='08:55 AM'),
            ArrivalItem(tripId=202, route='Route B', destination='Riverside', time='09:25 AM'),
            ArrivalItem(tripId=203, route='Route C', destination='Hilltop', time='10:10 AM'),
        ],
    )


@app.get('/api/tickets', response_model=TicketsResponse)
def get_tickets() -> TicketsResponse:
    return TicketsResponse(
        items=[
            TicketItem(
                id=1,
                route='Route A',
                name='Morning commuter pass',
                detail='Valid for the first departure window.',
                fare='R3.50',
                remaining=18,
                soldOut=False,
            ),
            TicketItem(
                id=2,
                route='Route B',
                name='Weekend express ticket',
                detail='Popular on Saturday peak service.',
                fare='R4.25',
                remaining=0,
                soldOut=True,
            ),
        ]
    )