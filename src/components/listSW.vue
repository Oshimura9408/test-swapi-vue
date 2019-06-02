<template>
  <div id="app">
    <ul class="toogle-list">
      <li class="toogle-list__item">
        <input
          type="radio"
          id="films"
          value="films"
          v-on:click="toogleT($event.target.value)"
          name="type"
          v-model="toogle"
          hidden
        >
        <label for="films" class="toogle-list__item--radio">Films</label>
      </li>
      <li class="toogle-list__item">
        <input
          type="radio"
          id="people"
          value="people"
          v-on:click="toogleT($event.target.value)"
          name="type"
          v-model="toogle"
          hidden
        >
        <label for="people" class="toogle-list__item--radio">People</label>
      </li>
      <li class="toogle-list__item">
        <input
          type="radio"
          id="starships"
          v-on:click="toogleT($event.target.value)"
          name="type"
          value="starships"
          v-model="toogle"
          hidden
        >
        <label for="starships" class="toogle-list__item--radio">Starships</label>
      </li>
    </ul>

    <div v-if="toogle != ''" class="search-container">
      <input type="text" v-on:input="checkInput" v-model="text" class="input-search">
      <button class="btn__search" @click="search">Search</button>
    </div>

    <ul class="filters" v-if="toogle === 'people' && this.$store.state.count != 0">
      <li>
        <input
          type="radio"
          @click="filterGender($event.target.value)"
          id="all"
          name="gender"
          value="all"
          v-model="filter"
          checked
        >
        <label for="all">All</label>
      </li>
      <li>
        <input
          type="radio"
          @click="filterGender($event.target.value)"
          id="male"
          name="gender"
          value="male"
          v-model="filter"
        >
        <label for="male">Male</label>
      </li>
      <li>
        <input
          type="radio"
          @click="filterGender($event.target.value)"
          id="female"
          name="gender"
          value="female"
          v-model="filter"
        >
        <label for="female">Female</label>
      </li>
      <li>
        <input
          type="radio"
          @click="filterGender($event.target.value)"
          id="undefined"
          name="gender"
          value="na"
          v-model="filter"
        >
        <label for="undefined">Undefined</label>
      </li>
    </ul>

    <div class="list-container" v-if="!this.$store.state.isLoading">
      <ul v-if="toogle != 'films'" class="list">
        <li
          @click="curItem(item)"
          class="list__item"
          v-for="item in toogleHand"
          :key="item.url"
        >{{item.name}}</li>
      </ul>

      <ul class="list" v-else>
        <li
          class="list__item"
          @click="curItem(item)"
          v-for="item in toogleHand"
          :key="item.url"
        >{{item.title}}</li>
      </ul>

      <div class="overlay" v-on:click.self="isShow = false" v-if="isShow"></div>

      <ul class="more-info" v-if="isShow">
        <h2>{{this.titleFilter}}</h2>
        <li class="more-info__item" v-for="p in ct" :key="p.name">
          <span class="more-info__title">{{p.name}} :</span>
          <span class="more-info__text">{{p.value}}</span>
        </li>
      </ul>
    </div>
    <div v-else class="loader"></div>
    <div v-if="this.$store.state.count === 0" class="not-find">Not find</div>
    <div class="controll-container">
      <button
        class="btn__controll btn__controll--prev"
        :disabled="pageNumber === 0"
        @click="prevPage"
      >Prev</button>
      <button
        class="btn__controll btn__controll--next"
        :disabled="pageNumber >= pageCount -1"
        @click="nextPage"
      >Next</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      result: null,
      nextRes: null,
      toogle: "",
      text: "",
      ct: null,
      pageNumber: 0,
      size: 10,
      filter: "",
      titleFilter: "",
      isShow: false
    };
  },

  methods: {
    uperWordord(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    checkInput() {
      if (this.text === "") {
        console.log("null");
        this.$store.dispatch("GET_REQ_LIST", {
          typeR: this.toogle,
          text: this.text
        });
      }
    },

    nextPage() {
      this.pageNumber++;
    },
    prevPage() {
      this.pageNumber--;
    },
    search() {
      this.$store.dispatch("GET_REQ_LIST", {
        typeR: this.toogle,
        text: this.text
      });
      this.pageNumber = 0;
    },

    toogleT(t) {
      this.text = "";
      this.$store.dispatch("GET_ALL_LIST", {
        typeR: t,
        text: this.text
      });
      this.$store.commit("SET_TITLE", t);

      this.ct = null;
    },

    curItem(item) {
      console.log(item);
      this.ct = item;
      this.titleFilter = item.name;
      let blacklist = ["created", "edited", "url", "name", "homeworld", "ope"];

      let test = Object.keys(item)
        .filter(key => {
          if (blacklist.indexOf(key) !== -1) return false;
          return true;
        })
        .map(key => {
          let value = item[key];
          const name = this.uperWordord(key.replace(/_\n/g, " "));
          if (key === "opening_crawl") {
            value = item[key].slice(0, 39) + "...";
            console.log(item[key].slice(0, 39));
          }

          if (typeof value === "object" && value.length !== undefined)
            value = value.length;

          return { name, value };
        });
      this.ct = test;
      this.isShow = true;
    },

    filterGender(f) {
      console.log(f);
      this.pageNumber = 0;
      let test = this.$store.state.allList.filter(item => {
        if (f === "na") {
          console.log("unde");
          return item.gender != "male" && item.gender != "female";
        } else if (f === "all") {
          console.log("all");
          return item;
        }

        return item.gender === f;
      });

      this.$store.commit("SET_LIST", test);

      console.log(this.$store.state.filterList);
    }
  },

  computed: {
    toogleHand() {
      const start = this.pageNumber * this.size,
        end = start + this.size;
      // console.log(start, end);
      if (this.$store.state.allList) {
        // return this.$store.state.allList;

        return this.$store.state.filterList.slice(start, end);
      }
      return null;
    },

    pageCount() {
      // if (this.$store.state.allList) {
      let l = this.$store.state.filterList.length,
        s = this.size;
      console.log(Math.ceil(l / s));
      return Math.ceil(l / s);
      // }
      // return null;
    }
  }
};
</script>

<style lang="less">
.loader {
  display: block;
  margin: 0 auto;
  border: 10px solid #f3f3f3;
  border-radius: 50%;
  border-top: 10px solid #5dbf16;
  width: 100px;
  height: 100px;
  animation: lds-ring 2s linear infinite;
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.toogle-list {
  display: flex;
  justify-content: space-between;
  max-width: 320px;
  margin: 25px auto 0;
  padding: 10px;

  &__item {
    width: 33%;
    &--radio {
      cursor: pointer;

      text-align: center;
      padding: 8px 20px;
      border: 1px solid rgba(167, 203, 213, 0.8);
      border-radius: 100px;
      width: 100%;
    }
  }
}

input[type="radio"]:checked + .toogle-list__item--radio {
  background: #60ce78;
  font-weight: 500;
  color: #fafbfb;
}

.input-search {
  font-size: 18px;
  line-height: 20px;
  display: block;
  width: 80%;
  max-width: 360px;
  margin: 15px auto;
  border: 1px solid rgba(167, 203, 213, 0.1);
  box-shadow: inset 0px 0px 4px rgba(90, 88, 99, 0.15);
  border-radius: 100px;
  padding: 12px 22px;
  outline: none;
}

.list {
  text-align: center;

  &-container {
    margin: 20px 0;
  }

  &__item {
    font-size: 18px;
    line-height: 28px;
    font-weight: 500;
  }
}

.more-info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: linear-gradient(
    87.31deg,
    #3fcd5e 34.25%,
    #26c051 99.99%,
    #26c051 100%
  );
  line-height: 24px;
  font-weight: 500;
  color: #ffffff;
  position: fixed;
  text-align: center;
  bottom: 0;
  width: 100%;
  height: 500px;
  z-index: 99;
  &__item {
    display: flex;
    width: 100%;
    max-width: 360px;
    margin: 0 auto;
    border-bottom: 1px solid rgba(90, 88, 99, 0.1);
  }

  &__title {
    font-size: 14px;

    margin-left: 10px;
    width: 55%;
    text-align: left;
  }
  &__text {
    font-size: 12px;
    text-align: left;
    width: 45%;
  }
}

.filters {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  width: 93%;
  max-width: 350px;
  margin: 0 auto;
  &__item {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
  }
}

.overlay {
  display: flex;
  background: rgba(45, 48, 56, 0.8);
  height: 100%;
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  z-index: 98;
  flex-direction: column;
  justify-content: flex-end;
}
.search-container {
  display: flex;
  flex-direction: column;
}
.btn__search {
  width: 80px;
  padding: 5px;
  margin: 0 auto 15px;
}

.controll-container {
  display: flex;
  width: 150px;
  justify-content: space-between;
  margin: 0 auto;
}

.btn__controll {
  width: 49%;
}
.not-find {
  text-align: center;
  font-size: 20px;
  line-height: 26px;
  font-weight: 600;
}
@media (min-width: 768px) {
  .more-info {
    width: 360px;
    left: calc(50% - 180px);
    top: calc(50% - 250px);
  }
}
</style>


