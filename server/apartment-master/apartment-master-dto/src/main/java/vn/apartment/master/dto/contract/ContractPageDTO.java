package vn.apartment.master.dto.contract;

import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.core.model.api.ApiPage;

import java.util.List;

@Schema(name = "Contract Page")
public class ContractPageDTO extends ApiPage<ContractDTO> {
    public ContractPageDTO(long total, List<ContractDTO> items) {super(total, items);}
}
