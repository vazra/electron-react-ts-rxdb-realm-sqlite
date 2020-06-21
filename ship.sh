# get the current branch 
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# bump version
yarn version --patch

# checkout release branch
git checkout release

# rebase to current branch
git rebase $BRANCH

# push 
git push && git push --tags

git checkout $BRANCH

# push master
git push && git push --tags
