#!/bin/bash

REPO_URL="https://github.com/Nk-Petrov/Website-Cloner.git"
BRANCH="main"
MSG="auto commit"

echo "INICIANDO GIT..."

if [ ! -d ".git" ]; then
  git init
fi

git checkout -B $BRANCH

git add .

if git diff --cached --quiet; then
  echo "[ INFO ] Nenhuma mudança para commit"
else
  git commit -m "$MSG"
fi

if git remote | grep -q origin; then
  echo "[ INFO ] Remote já existe"
else
  git remote add origin $REPO_URL
fi

echo "DIGITE SEU TOKEN DO GITHUB:"
read TOKEN

echo "[ PUSH ] enviando para GitHub..."

git push -u https://Nk-Petrov:$TOKEN@github.com/Nk-Petrov/Website-Cloner.git $BRANCH

echo "[ SUCESS ] FINALIZADO"