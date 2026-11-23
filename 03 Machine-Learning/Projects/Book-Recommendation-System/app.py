from flask import Flask,request, render_template
import pickle

import numpy as np

popular_df = pickle.load(open('./popular.pkl', 'rb'))
books=pickle.load(open("./books.pkl","rb"))
pt=pickle.load(open('./pt.pkl','rb'))
similarity_score=pickle.load(open('./similarity_score.pkl','rb'))
popular_df['Image-URL-M'] = popular_df['Image-URL-M'].str.replace('http://', 'https://', regex=False)
books['Image-URL-M'] = books['Image-URL-M'].str.replace('http://', 'https://', regex=False)


app = Flask(__name__)


# Removed the trailing colon here
@app.route('/')
def index():
  
  return render_template('index.html', book_name=list(popular_df['Book-Title'].values), 
                                        author=list(popular_df['Book-Author'].values),
                                        image=list(popular_df['Image-URL-M'].values),
                                        votes=list(popular_df['num-ratings'].values),
                                        rating=list(popular_df['avg-ratings'].values))


@app.route("/recommend")
def recommendUi():
    return render_template('recommend.html')
 
@app.route("/recommend-book", methods=['post'])
def recommend():
    user_input=request.form.get('user_input')
    matches=np.where(pt.index==user_input)[0]
    data=[]
    error=None
    if user_input and len(matches) > 0:
        index=np.where(pt.index==user_input)[0][0]
        similar_items=sorted(list(enumerate(similarity_score[index])), key=lambda x:x[1], reverse=True)[1:6]
    
        for i in similar_items:
            item=[]
            temp_df=books[books['Book-Title']== pt.index[i[0]]]
            item.extend(list(temp_df.drop_duplicates('Book-Title')['Book-Title'].values))
            item.extend(list(temp_df.drop_duplicates('Book-Title')['Book-Author'].values))
            item.extend(list(temp_df.drop_duplicates('Book-Title')['Image-URL-M'].values))
            data.append(item)
        print(data)
    elif user_input:
        error = f'"{user_input}" isn\'t in the catalog yet. Try another title.'
    return render_template('recommend.html', data=data, error=error,query=user_input, all_titles=sorted(pt.index))
    

if __name__ == '__main__':
  app.run(debug=True)