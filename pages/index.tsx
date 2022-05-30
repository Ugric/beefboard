import type { NextPage } from 'next'
import Head from 'next/head'
import Navbar from '../components/navbar';
import Post from '../components/post';
import styles from '../styles/Home.module.css'
import "../styles/colour-palette.css";

const Home: NextPage = () => {
  return (
    <>  <Navbar></Navbar>
    <div className={styles.container}>
      <Head>
        <title>BeefBoard</title>
      </Head>
      <Post></Post>
    </div></>
  );
}

export default Home
