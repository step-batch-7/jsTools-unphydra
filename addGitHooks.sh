#! /bin/zsh

cat <<EOF > .git/hooks/pre-commit 
mocha && ./runAppTest.sh appTests/*.test
if [ \$? != 0 ]; then
 echo "\033[1;31mFix The Test First\033[0m\n"
  exit 1
fi
EOF

chmod +x .git/hooks/pre-commit;

cat <<EOF > .git/hooks/pre-push  
npm run lint 
if [ \$? != 0 ]; then
echo "\033[1;31mFix The Eslint rules conflicting\033[0m\n"
    exit 1
fi
EOF


chmod +x .git/hooks/pre-push;