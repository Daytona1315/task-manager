FROM python:3.11.9-slim

COPY project/requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD [ "uvicorn", "project.src.app:app", "--host", "0.0.0.0", "--port", "5000"]