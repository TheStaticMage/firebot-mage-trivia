#!/bin/bash

echo "Checking for files that do not end in a newline..."

result=$(mktemp /tmp/check-newline.XXXXXX)
trap 'rm -f "$result"' EXIT

git ls-files --cached --others --exclude-standard | while IFS= read -r file; do
    if [ "$file" == "misc/setup/MageTriviaResources.firebotsetup" ]; then
        continue
    fi

    if ! file "$file" | grep -q "text"; then
        continue
    fi

    last_char=$(tail -c 1 "$file")
    if [ "$last_char" != "" ] && [ "$last_char" != $'\n' ]; then
        echo "::error file=$file::File does not end with a newline character."
        echo "$file" >> "$result"
    fi
done

if [ -s "$result" ]; then
    echo "Some files do not end with a newline character."
    exitcode=1
else
    echo "All files end with a newline character."
    exitcode=0
fi
exit $exitcode
