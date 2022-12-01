package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"strings"
	"strconv"
	"os"
)

func main() {
	file, err := ioutil.ReadFile("input.txt")
	if err != nil {
		log.Fatal(err)
	}

	text := string(file)

	numbers := strings.Split(text, "\n")

	numbers = numbers[:len(numbers)-1]

	for i := 0; i < len(numbers); i++ {
		numI, err := strconv.Atoi(numbers[i])
		if (err != nil) {
			log.Fatal(err)
		}

		for j := 0; j < len(numbers); j++ {
			numJ, err := strconv.Atoi(numbers[j])
			if (err != nil) {
				log.Fatal(err)
			}

			for k := 0; k < len(numbers); k++ {
				numK, err := strconv.Atoi(numbers[k])
				if (err != nil) {
					log.Fatal(err)
				}

				if (numI + numJ + numK == 2020) {
					fmt.Println(numI * numJ * numK)
					os.Exit(0)
				}
			}
		}
	}
}
