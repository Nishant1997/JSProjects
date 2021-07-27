import java.util.*;

public class test{
     public static void main(String[] args) {

        // bitset testing
        BitSet bs = BitSet.valueOf(new long[]{7});
        bs.flip(0, bs.length());
               
        System.out.print("bs: "+ bs + " -- "+bs.length() );
    }

}