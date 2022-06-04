import { faker } from "@faker-js/faker";
import { postProps } from "../components/post";
import { adsenseProps } from "../components/posts";

if (typeof window !== "undefined") {
    while (true) {
        console.log('GET recommended.ts OFF THE CLIENT SIDE!');
    }
}

function recommended(): (postProps | adsenseProps)[] {
    const chosenPosts:  (postProps | adsenseProps)[] = Array.from({ length: 10 }, () => ({
      title: faker.lorem.sentence(),
      content: [faker.lorem.paragraph(100)],
      votes: Math.round(Math.random() * 1000000),
      voted: 0,
      id: faker.random.alphaNumeric(100),
      time: new Date(faker.date.past()).getTime(),
    }));
    const putads: number[] = [
        
    ]
    for (let i = 0; i < chosenPosts.length; i++) {
        if (Math.random()<0.1) {
            putads.push(i);
        }
    }
    for (let i = 0; i < putads.length; i++) {
        chosenPosts.splice(putads[i]+i, 0, {
            type: 'adsense'
        })
    }
    return chosenPosts;
}

export default recommended;