from app import create_app
from app.extensions import mongo
from datetime import datetime

def add_christie_books():
    books = [
        {
            "title": "Murder on the Orient Express",
            "author": "Agatha Christie",
            "description": "Famous detective Hercule Poirot investigates a murder on the trapped Orient Express train, where all passengers are suspects.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "And Then There Were None",
            "author": "Agatha Christie",
            "description": "Ten strangers are lured to an isolated island mansion, each accused of a terrible crime, as they start dying one by one.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "Death on the Nile",
            "author": "Agatha Christie",
            "description": "Hercule Poirot must solve a murder mystery aboard a cruise ship on the Nile River, where everyone has a motive.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "The ABC Murders",
            "author": "Agatha Christie",
            "description": "A serial killer working through the alphabet challenges Poirot to solve the murders before they happen.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "The Murder of Roger Ackroyd",
            "author": "Agatha Christie",
            "description": "A groundbreaking mystery novel that revolutionized the genre, following the murder of a wealthy man in a quiet English village.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "Evil Under the Sun",
            "author": "Agatha Christie",
            "description": "At a seaside resort, Poirot investigates the murder of a beautiful actress who had many enemies.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "Murder at the Vicarage",
            "author": "Agatha Christie",
            "description": "The first Miss Marple mystery, where the shrewd detective investigates a murder in the quiet village of St. Mary Mead.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "Crooked House",
            "author": "Agatha Christie",
            "description": "A wealthy businessman is murdered in his own home, and every family member is a suspect.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "The Body in the Library",
            "author": "Agatha Christie",
            "description": "Miss Marple investigates when a young woman's body is found in the library of a respectable household.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "Five Little Pigs",
            "author": "Agatha Christie",
            "description": "Sixteen years after a woman was convicted of poisoning her husband, Poirot reinvestigates the murder.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "A Murder is Announced",
            "author": "Agatha Christie",
            "description": "Miss Marple investigates when a murder is announced in the local newspaper before it happens.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "Peril at End House",
            "author": "Agatha Christie",
            "description": "Poirot must protect a young woman who seems to be the target of several suspicious accidents.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "The Moving Finger",
            "author": "Agatha Christie",
            "description": "A series of poison pen letters leads to murder in a quiet English village, requiring Miss Marple's investigation.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "Cards on the Table",
            "author": "Agatha Christie",
            "description": "Four sleuths and four suspects play bridge while murder is committed in plain sight.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "Dead Man's Folly",
            "author": "Agatha Christie",
            "description": "A murder hunt game turns real when an actual body is discovered during a village fête.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "Appointment with Death",
            "author": "Agatha Christie",
            "description": "Hercule Poirot investigates the murder of a tyrannical mother in the ancient city of Petra.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "The Murder on the Links",
            "author": "Agatha Christie",
            "description": "Poirot investigates when a wealthy man is found stabbed to death on a golf course.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "4.50 from Paddington",
            "author": "Agatha Christie",
            "description": "Miss Marple helps solve a murder that was witnessed through a train window.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "Death in the Clouds",
            "author": "Agatha Christie",
            "description": "A woman is killed on a flight, and Poirot must solve the murder among the limited passengers.",
            "created_at": datetime.utcnow()
        },
        {
            "title": "The Mysterious Affair at Styles",
            "author": "Agatha Christie",
            "description": "Hercule Poirot's first case, investigating the murder of a wealthy woman by poisoning.",
            "created_at": datetime.utcnow()
        }
    ]

    app = create_app()

    with app.app_context():
        added_count = 0
        skipped_count = 0

        print("\nStarting to add Agatha Christie books...")
        print("=" * 50)

        for book in books:
            # Check if book already exists
            existing_book = mongo.db.books.find_one({
                "title": book["title"],
                "author": book["author"]
            })

            if not existing_book:
                mongo.db.books.insert_one(book)
                print(f"✅ Added: {book['title']}")
                added_count += 1
            else:
                print(f"⏭️  Skipped (already exists): {book['title']}")
                skipped_count += 1

        print("=" * 50)
        print(f"\nProcess completed!")
        print(f"Books added: {added_count}")
        print(f"Books skipped: {skipped_count}")
        print(f"Total books processed: {len(books)}")

if __name__ == "__main__":
    add_christie_books()