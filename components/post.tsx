import styled from 'styled-components';

const PostContainer = styled.div`
    background-color: #fff;
    border-radius: 5px;
    padding: 20px;
    margin: 0 auto;
    max-width: 700px;
    margin: 0 auto;
`


function Post() { 
    return (
      <PostContainer>
        <h1>Post</h1>
      </PostContainer>
    );
}

export default Post;