## RAW SQL
 ```sql
 SELECT
    "user"."id", "user"."firstName", "user"."lastName", "user"."photoURLs"   
    ST_Distance("user"."location", (SELECT location FROM users WHERE id=?)) 
        AS distance,
    array_agg("preferences"."category") as preferences,
    "matcheeId" IS NOT NULL AS match
    FROM "users" AS "user"
    INNER JOIN (
            "user_preferences"
            INNER JOIN "preferences"
            ON "preferences"."id" = "user_preferences"."preferenceId"
            )
        ON "user"."id" = "user_preferences"."userId" 
        AND "preferences"."id" IN ( 
            SELECT "preferenceId" FROM user_preferences WHERE "userId" = ?
             )
    LEFT JOIN "matches" AS "match" 
        ON "user"."id" = "match"."matcherId" 
        AND "match"."matcheeId" = ?
    WHERE (("user"."id" NOT IN (?) AND "user"."hasMatched" IS NULL))
    GROUP BY "user"."id", "matcheeId"
    ORDER BY match DESC, "user"."location" <-> (
            SELECT location FROM users WHERE id = ? 
            )
    LIMIT 5;
    
```


## Breakdown

```sql
SELECT
    "user"."id", "user"."firstName", "user"."lastName", "user"."photoURLs"   
```
We want those columns from the user table.

```sql
ST_Distance("user"."location", (SELECT location FROM users WHERE id=?)) 
    AS distance
```
(NOT for use in production) A PostGIS function. that calculates distance between two geometries. Here we are asking it to give us the distance between the user requesting for matches and a potential match.

```sql
 array_agg("preferences"."category") as preferences,
```
Aggregate the users preferences into an array

```sql
"matcheeId" IS NOT NULL AS match
```
Whether or not the potential match has already chosen to match with the user. This column will carry the most weight when we sort them.

```sql
FROM "users" AS "user"
```
From the `users` table, which we will alias as `user`.


```sql
INNER JOIN (
            "user_preferences"
            INNER JOIN "preferences"
            ON "preferences"."id" = "user_preferences"."preferenceId"
            )
        ON "user"."id" = "user_preferences"."userId" 
```
Because we are using a thru table for a users preferences, lets get those with some simple joins so we can use them in the outer query


```sql
AND "preferences"."id" IN ( 
            SELECT "preferenceId" FROM user_preferences WHERE "userId" = ?
             )
```
A nested query to get the requesting users preferences. This is nice because be can quickly grab the `id` of preferences from the `user_preferences` table.


```sql
 LEFT JOIN "matches" AS "match" 
  ON "user"."id" = "match"."matcherId" 
        AND "match"."matcheeId" = ?
```
Very important for finding an prioritizing those who have already swiped right on the requesting user. We do `LEFT JOIN` because we want to include those who have not chosen to match as well.

```sql
 WHERE (("user"."id" NOT IN (?) AND "user"."hasMatched" IS NULL))
```
We want to exclude those who the current user has swiped on AND those that have already matched with someone else.

```sql
 GROUP BY "user"."id", "matcheeId"
```
We are doing this so we can aggregate the preferences into an array


```sql
 ORDER BY match DESC, "user"."location" <-> (
            SELECT location FROM users WHERE id = ? 
            )
```
The sorting. We want to priotize those that have chosen to match first and then by distance.

```sql
 LIMIT 5;
```
Because of how dynamic the data is, lets only send five at a time because the user's potential matches may constantly be changing