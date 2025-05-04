git filter-repo --force --commit-callback '
if commit.author_email == b"115573995+timothmac@users.noreply.github.com":
    commit.author_name = b"Vlad"
    commit.author_email = b"v.chernyshchuk@student.csn.khai.edu"
    commit.committer_name = b"Vlad"
    commit.committer_email = b"v.chernyshchuk@student.csn.khai.edu"
'
