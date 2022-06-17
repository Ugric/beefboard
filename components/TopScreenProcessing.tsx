import styles from "../styles/TopScreenProcessing.module.css";

const TopScreenProcessing = ({
    progress
}: {
    progress: number
    }) => {
    
    return <div className={styles.progress} style={{
        width: `${(progress>0? progress<1?progress:1:0) * 100}%`
        , opacity: progress<1?1:0
    }} />;
}
export default TopScreenProcessing
export {
    TopScreenProcessing
}