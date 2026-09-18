# # from app.core.database import SessionLocal
# # from app.models.models import User, Product, Order, OrderItem
# # import bcrypt

# # def get_safe_password_hash(password: str) -> str:
# #     pwd_bytes = password.encode('utf-8')
# #     salt = bcrypt.gensalt()
# #     hashed = bcrypt.hashpw(pwd_bytes, salt)
# #     return hashed.decode('utf-8')

# # def seed_database():
# #     db = SessionLocal()
# #     try:
# #         if db.query(Product).first():
# #             print("Database already has data. Skipping seeding.")
# #             return

# #         print("Seeding database with sample data...")

# #         # 1. Create sample Admin and Customer
# #         admin_user = User(
# #             name="Admin User",
# #             email="admin@aiops.com",
# #             hashed_password=get_safe_password_hash("admin123"),
# #             role="admin"
# #         )
# #         customer_user = User(
# #             name="Waleed Khokhar",
# #             email="waleed@aiops.com",
# #             hashed_password=get_safe_password_hash("password123"),
# #             role="customer"
# #         )
# #         db.add_all([admin_user, customer_user])
# #         db.commit()
# #         db.refresh(customer_user)

# #         # 2. Create sample Products for the Support RAG Agent
# #         p1 = Product(name="AI Cloud Server Pro", description="High-performance cloud hosting with dedicated GPU for LLM training.", price=199.99, stock_quantity=45, category="Cloud Infrastructure")
# #         p2 = Product(name="Smart Vector DB Cluster", description="Enterprise-grade vector database managed storage instance.", price=89.50, stock_quantity=120, category="Databases")
# #         p3 = Product(name="Agentic Automation Suite", description="Pre-built LangGraph agent workflows for enterprise customer service.", price=299.00, stock_quantity=15, category="AI Software")
        
# #         db.add_all([p1, p2, p3])
# #         db.commit()
# #         db.refresh(p1)
# #         db.refresh(p2)

# #         # 3. Create Order dynamically matching model columns
# #         order_columns = [col.name for col in Order.__table__.columns]
# #         order_data = {"total_amount": 289.49, "status": "completed"}
        
# #         if "user_id" in order_columns:
# #             order_data["user_id"] = customer_user.id
# #         elif "customer_id" in order_columns:
# #             order_data["customer_id"] = customer_user.id

# #         order = Order(**order_data)
# #         db.add(order)
# #         db.commit()
# #         db.refresh(order)

# #         # 4. Create Order Items dynamically matching model columns
# #         item_columns = [col.name for col in OrderItem.__table__.columns]
        
# #         item1_data = {"order_id": order.id, "product_id": p1.id, "quantity": 1, "price": 199.99}
# #         item2_data = {"order_id": order.id, "product_id": p2.id, "quantity": 1, "price": 89.50}
        
# #         item1_data = {k: v for k, v in item1_data.items() if k in item_columns}
# #         item2_data = {k: v for k, v in item2_data.items() if k in item_columns}

# #         item1 = OrderItem(**item1_data)
# #         item2 = OrderItem(**item2_data)
# #         db.add_all([item1, item2])
# #         db.commit()

# #         print("Database seeded successfully!")
# #     except Exception as e:
# #         print(f"Error seeding database: {e}")
# #         db.rollback()
# #     finally:
# #         db.close()

# # if __name__ == "__main__":
# #     seed_database()
# from app.core.database import SessionLocal
# from app.models.models import User, Product, Order, OrderItem
# import bcrypt

# def get_safe_password_hash(password: str) -> str:
#     pwd_bytes = password.encode('utf-8')
#     salt = bcrypt.gensalt()
#     hashed = bcrypt.hashpw(pwd_bytes, salt)
#     return hashed.decode('utf-8')

# def seed_database():
#     db = SessionLocal()
#     try:
#         # Check if database already has products to prevent redundant clutter
#         if db.query(Product).first():
#             print("Database already has data. Skipping seeding.")
#             return

#         print("Seeding database with expanded sample data...")

#         # 1. Create Multiple Users (Admins and Customers)
#         admin_user = User(
#             name="Admin User",
#             email="admin@aiops.com",
#             hashed_password=get_safe_password_hash("admin123"),
#             role="admin"
#         )
#         customer1 = User(
#             name="Waleed Khokhar",
#             email="waleed@aiops.com",
#             hashed_password=get_safe_password_hash("password123"),
#             role="customer"
#         )
#         customer2 = User(
#             name="Aisha Khan",
#             email="aisha@example.com",
#             hashed_password=get_safe_password_hash("password123"),
#             role="customer"
#         )
#         customer3 = User(
#             name="Hamza Ali",
#             email="hamza@example.com",
#             hashed_password=get_safe_password_hash("password123"),
#             role="customer"
#         )
#         db.add_all([admin_user, customer1, customer2, customer3])
#         db.commit()

#         # 2. Create Diverse Products
#         p1 = Product(name="AI Cloud Server Pro", description="High-performance cloud hosting with dedicated GPU for LLM training.", price=199.99, stock_quantity=45, category="Cloud Infrastructure")
#         p2 = Product(name="Smart Vector DB Cluster", description="Enterprise-grade vector database managed storage instance.", price=89.50, stock_quantity=120, category="Databases")
#         p3 = Product(name="Agentic Automation Suite", description="Pre-built LangGraph agent workflows for enterprise customer service.", price=299.00, stock_quantity=15, category="AI Software")
#         p4 = Product(name="Neural Network Monitor", description="Real-time observability dashboard for tracking token usage and latency.", price=149.00, stock_quantity=60, category="DevOps Tools")
#         p5 = Product(name="LLM Security Gateway", description="Enterprise firewall protecting applications against prompt injection and data leaks.", price=249.99, stock_quantity=30, category="Security")
        
#         db.add_all([p1, p2, p3, p4, p5])
#         db.commit()

#         # 3. Create Multiple Orders and Order Items dynamically
#         order_columns = [col.name for col in Order.__table__.columns]
#         item_columns = [col.name for col in OrderItem.__table__.columns]

#         orders_data = [
#             {"user": customer1, "total": 289.49, "status": "completed", "items": [(p1, 1), (p2, 1)]},
#             {"user": customer2, "total": 299.00, "status": "completed", "items": [(p3, 1)]},
#             {"user": customer1, "total": 398.98, "status": "pending", "items": [(p1, 2)]},
#             {"user": customer3, "total": 399.99, "status": "completed", "items": [(p4, 1), (p5, 1)]}
#         ]

#         for data in orders_data:
#             order_dict = {"total_amount": data["total"], "status": data["status"]}
#             if "user_id" in order_columns:
#                 order_dict["user_id"] = data["user"].id
#             elif "customer_id" in order_columns:
#                 order_dict["customer_id"] = data["user"].id

#             order = Order(**order_dict)
#             db.add(order)
#             db.commit()
#             db.refresh(order)

#             for prod, qty in data["items"]:
#                 item_dict = {"order_id": order.id, "product_id": prod.id, "quantity": qty, "price": prod.price}
#                 item_dict = {k: v for k, v in item_dict.items() if k in item_columns}
#                 db.add(OrderItem(**item_dict))
#             db.commit()

#         print("Expanded database seeded successfully!")
#     except Exception as e:
#         print(f"Error seeding database: {e}")
#         db.rollback()
#     finally:
#         db.close()

# if __name__ == "__main__":
#     seed_database()
def seed_database():
    db = SessionLocal()
    try:
        print("Clearing old data and reseeding database...")
        # Optional: Wipe existing tables to prevent duplicates
        db.query(OrderItem).delete()
        db.query(Order).delete()
        db.query(Product).delete()
        db.query(User).delete()
        db.commit()
        
        # ... rest of your seed creation code goes here ...